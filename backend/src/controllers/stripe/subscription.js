import stripe from "../../config/stripe";
import express from 'express';
import {requireAuth, clerkClient} from "@clerk/express";
import { getOrCreateStripeUser, createSubscription } from "./subscriptionHelper";


const subscriptionRouter = express.Router()

subscriptionRouter.use(requireAuth())

subscriptionRouter.post('/test-payment-intent', async (req, res, next) => {
    const amount = req.body.amount;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.status(200).send(paymentIntent);
    } catch (error) {
        next(error);
    }
});

subscriptionRouter.post('/', async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).send("User is not authorized");
        }
        const customer = await getOrCreateStripeUser(req.auth)
        const subscription = await createSubscription(customer, "price_1Qkq1jCMcuLX2RyD9ReWHWNm")
        return res.status(200).json(subscription);
    } catch (error) {
        next(error);
    }
});

subscriptionRouter.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from subscription" });
});

export default subscriptionRouter;

// comment something 

