import stripe from '../../config/stripe'
import { clerkClient, AuthObject } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

export const getOrCreateStripeUser = async (auth: AuthObject) => {

    if (!auth.userId)  {
        throw new Error('User not authenticated')
    }

    const user = await clerkClient.users.getUser(auth.userId)

    if (!user) {
        throw new Error('User not found')
    }


    const search = await stripe.customers.search({
        query: `email:'${user?.primaryEmailAddress?.emailAddress}' metadata['clerk_id']:'${user.id}'`
    })

    let customer

    if (search.data.length === 0) {
        customer = await stripe.customers.create({
            name: user.fullName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            metadata: { clerk_id: user.id }
        })

        const prisma = new PrismaClient()

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                stripe_id: customer.id
            }
        })

    } else customer = search.data[0]

    return customer
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