import { Hono, HonoRequest } from "hono";
import { AuthObject } from "@clerk/backend";
import stripe from "@/clients/stripe";
import config from "@/utils/config";

const stripeRouter = new Hono()

interface AuthRequest extends HonoRequest {
    auth: AuthObject
}

const signing_secret = config.STRIPE_SIGNING_SECRET

stripeRouter.post("/webhook", async(c) => {
    const signature = c.req.header('stripe-signature') as string

    if (!signing_secret) {
        throw new Error('Error: Please add SIGNING_SECRET from Stripe Dashboard to .env')
    }

    const body = await c.req.json()
    const event = await stripe.webhooks.constructEventAsync(body, signature, signing_secret)

    switch (event.type) {
        case 'customer.subscription.created': {
            console.log("Subscription created", event.data.object)
            break
        }
        case 'customer.subscription.updated': {
            console.log("Subscription updated", event.data.object)
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
    return c.json({ received: true }, 200)
})

export default stripeRouter
