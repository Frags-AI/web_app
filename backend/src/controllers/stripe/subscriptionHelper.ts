import stripe from '../../config/stripe'
import { clerkClient } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

export const getStripeUser = async (userId: string) => {
    if (!userId)  {
        throw new Error('User not authenticated')
    }

    const user = await clerkClient.users.getUser(userId)

    if (!user) {
        throw new Error('User not found')
    }

    const search = await stripe.customers.search({
        query: `email:'${user?.primaryEmailAddress?.emailAddress}' metadata['clerk_id']:'${user.id}'`
    })

    const customer = search.data[0]

    return customer
}

export const createStripeUser = async (userId: string) => {
    if (!userId)  {
        throw new Error('User not authenticated')
    }

    const user = await clerkClient.users.getUser(userId)

    if (!user) {
        throw new Error('User not found')
    }

    const customer = await stripe.customers.create({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        metadata: { clerk_id: user.id }
    })

    const prisma = new PrismaClient()

    const res = await prisma.user.update({
        where: {
            clerk_user_id: user.id
        },
        data: {
            stripe_id: customer.id
        }
    })

    return res
}

export const createSubscription = async (customer: {id?: string}, lookupKey: string) => {

    if (!customer.id) {
        throw new Error('Customer ID is required to create a subscription')
    }

    const price = (await stripe.prices.search({query: `lookup_key:'${lookupKey}'`})).data[0]

    if (!price) {
        throw new Error('Price not found')
    }

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
            price: price.id
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
    })

    let clientSecret
    if (typeof subscription.latest_invoice !== "string" && subscription.latest_invoice?.payment_intent) {
        const paymentIntent = subscription.latest_invoice.payment_intent

        if (typeof paymentIntent !== "string") {
            clientSecret = paymentIntent?.client_secret
        } else {
            clientSecret = ""
        }
    }

    return {
        subscriptionId: subscription.id, 
        clientSecret
    }

}

    // const subscription = await stripe.subscriptionSchedules.create({
    //     customer: customer.id,
    //     start_date: new Date().getTime() / 1000,
    //     end_behavior: 'release',
    //     phases: [
    //         {
    //             items: [
    //                 {
    //                     price,
    //                     quantity: 1
    //                 }
    //             ],
    //             iterations: 1
    //         }
    //     ],
    //     expand: ["subscription.latest_invoice.payment_intent"]
    // })