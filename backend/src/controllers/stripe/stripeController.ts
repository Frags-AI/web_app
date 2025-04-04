import express from 'express';
import { requireAuth, AuthObject } from '@clerk/express';
import subscriptionRouter from './subscriptionController';
import { Request, Response } from 'express';
import config from '@/utils/config';
import Stripe from 'stripe';

const stripeRouter = express.Router();
const stripe = new Stripe(config.STRIPE_SECRET, {
    typescript: true,
});

stripeRouter.use(requireAuth());

interface AuthRequest extends Request {
    auth: AuthObject;
}

const signing_secret = config.STRIPE_SIGNING_SECRET

stripeRouter.post('/webhook', async(req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string

    const event = stripe.webhooks.constructEvent(req.body, signature, signing_secret)

    switch (event.type) {
        case 'customer.subscription.created': {
            console.log("Subscription created", event.data.object)
            res.status(200).json({ received: true })
            break
        }
        case 'customer.subscription.updated': {
            console.log("Subscription updated", event.data.object)
        }
        case 'customer.subscription.deleted': {
            console.log("Subscription deleted", event.data.object)
        }
        case 'customer.subscription.paused': {
            console.log("Subscription paused", event.data.object)
        }
        case 'customer.subscription.resumed': {
            console.log("Subscription resumed", event.data.object)
        }
        default: break

    }

    console.log("Received event: ", event.type)
    res.status(200).json({ received: true })
})

stripeRouter.use("/subscription", subscriptionRouter);

export default stripeRouter