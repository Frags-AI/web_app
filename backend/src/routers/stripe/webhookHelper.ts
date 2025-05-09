import Stripe from "stripe"
import stripe from "@/clients/stripe"
import { PrismaClient } from "@prisma/client"

export const handleWebhooks = async (event: Stripe.Event) => {
    switch (event.type) {
        case 'customer.subscription.created': {
            console.log("Subscription created", event.data.object)
            break
        }
        case 'customer.subscription.updated': {

            const subscription = event.data.object
            const customerId = subscription.customer as string
            let customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
            const defaultPaymentMethod = subscription.default_payment_method as string
            const temp = subscription.items.data[0].price.lookup_key?.split("_")[0] as string
            const plan = temp?.charAt(0).toUpperCase() + temp?.slice(1)
            console.log(customerId)

            if (!customer.invoice_settings.default_payment_method) {
                customer = await stripe.customers.update(customerId, {
                    invoice_settings: {
                        default_payment_method: defaultPaymentMethod,
                    }
                })
            }

            const prisma = new PrismaClient()
            const user = await prisma.user.findFirst({ where: { stripe_id: customerId } })

            if (!user) return { received: true, type: event.type, code: 401 }

            const subscriptionData = {
                stripe_id:subscription.id,
                status: subscription.status,
                userId: user.id,
                plan: plan,
                periodStart: new Date(subscription.items.data[0].current_period_start),
                periodEnd: new Date(subscription.items.data[0].current_period_end),
                trialStart: new Date(subscription.trial_start ? subscription.trial_start : 0),
                trialEnd: new Date(subscription.trial_end ? subscription.trial_end : 0),
            }

            await prisma.subscription.upsert({
                where: {
                    userId: user.id
                },
                update: subscriptionData,
                create: subscriptionData
            })

            break
        }
        case 'customer.subscription.deleted': {
            console.log("Subscription deleted", event.data.object)
            break
        }
        case 'customer.subscription.paused': {
            console.log("Subscription paused", event.data.object)
            break
        }
        case 'customer.subscription.resumed': {
            console.log("Subscription resumed", event.data.object)
            break
        }
    }
    return { received: true, type: event.type, code: 201 }
}