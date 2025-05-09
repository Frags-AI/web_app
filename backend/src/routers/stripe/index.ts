import { Hono } from "hono";
import { subscriptionRouter } from "@/routers/stripe/subscriptions/subscriptionRouter";
import { invoiceRouter } from "./invoices/invoiceRouter";
import stripe from "@/clients/stripe";
import config from "@/utils/config";
import { handleWebhooks } from "./webhookHelper";
import { ContentfulStatusCode } from "hono/utils/http-status";

const stripeRouter = new Hono()

const signing_secret = config.STRIPE_SIGNING_SECRET

stripeRouter.post("/webhook", async(c) => {
    const headers = c.req.header()
    const signature = headers["stripe-signature"] as string

    if (!signing_secret) {
        throw new Error('Error: Please add SIGNING_SECRET from Stripe Dashboard to .env')
    }

    const body = await c.req.text()
    const event = await stripe.webhooks.constructEventAsync(body, signature, signing_secret)

    const result = await handleWebhooks(event)

    return c.json({ received: result.received, type: result.type }, result.code as ContentfulStatusCode)
})

stripeRouter.route("/subscription", subscriptionRouter)
stripeRouter.route("/invoice", invoiceRouter)

export default stripeRouter
