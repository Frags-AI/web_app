import { Hono, HonoRequest } from "hono";
import { AuthObject } from "@clerk/backend";
import subscriptionRouter from "@/routers/stripe/subscriptionRouter";
import stripe from "@/clients/stripe";
import Stripe from "stripe";
import config from "@/utils/config";

const stripeRouter = new Hono()

interface AuthRequest extends HonoRequest {
    auth: AuthObject
}

const signing_secret = config.STRIPE_SIGNING_SECRET

stripeRouter.post("/webhook", async(c) => {
    const headers = c.req.header()
    const signature = headers["stripe-signature"] as string

    if (!signing_secret) {
        throw new Error('Error: Please add SIGNING_SECRET from Stripe Dashboard to .env')
    }

    const body = await c.req.text()
    const event = await stripe.webhooks.constructEventAsync(body, signature, signing_secret)

    switch (event.type) {
        case 'customer.subscription.created': {
            console.log("Subscription created", event.data.object)
            break
        }
        case 'customer.subscription.updated': {

            const customerId = event.data.object.customer as string
            let customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
            const defaultPaymentMethod = event.data.object.default_payment_method as string


            if (!customer.invoice_settings.default_payment_method) {
                customer = await stripe.customers.update(customerId, {
                    invoice_settings: {
                        default_payment_method: defaultPaymentMethod,
                        
                    }
                })
            }
            console.log(customer)
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

    console.log("Received event: ", event.type)
    return c.json({ received: true, type: event.type }, 200)
})

stripeRouter.route("/subscription", subscriptionRouter)

export default stripeRouter
