import stripe from "../../config/stripe";
import express, {Request, Response, NextFunction} from 'express';
import {requireAuth, AuthObject } from "@clerk/express";
import { getOrCreateStripeUser, createSubscription } from "./subscriptionHelper";


const subscriptionRouter = express.Router()

subscriptionRouter.use(requireAuth())

interface AuthRequest extends Request {
    auth: AuthObject
}

subscriptionRouter.post('/test-payment-intent', async (req: Request, res: Response, next: NextFunction) => {
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

subscriptionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {

    const request = req as AuthRequest;

    try {
        const userId = request.auth.userId;

        if (!userId) {
            res.status(401).send("User is not authorized");
        }
        const customer = await getOrCreateStripeUser(request.auth)
        const subscription = await createSubscription(customer, "price_1Qkq1jCMcuLX2RyD9ReWHWNm")
        res.status(200).json(subscription);
    } catch (error) {
        next(error);
    }
});

subscriptionRouter.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from subscription" });
});

export default subscriptionRouter;

