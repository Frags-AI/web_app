import stripe from "@/clients/stripe";
import clerkClient from "@/clients/clerk";
import { PrismaClient } from "@/clients/prisma";

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