import express, { Request, Response, NextFunction } from 'express';
import { requireAuth, AuthObject } from "@clerk/express";
import { getStripeUser, createSubscription } from "./subscriptionHelper";


const subscriptionRouter = express.Router()

subscriptionRouter.use(requireAuth())

interface AuthRequest extends Request {
    auth: AuthObject
}

subscriptionRouter.post('/', async (req: Request, res: Response, next: NextFunction)  => {
    const request = req as AuthRequest;

    const userId = request?.auth?.userId;
    const lookupKey: string = req.body.lookupKey || null;

    if (!userId) {
        res.status(401).json({message: "User is not authorized"});
    } else if (lookupKey === null) { 
        res.status(400).send({message: "Lookup key is required"});
    } else {
        const customer = await getStripeUser(request.auth.userId);
        const subscription = await createSubscription(customer, lookupKey);
        res.status(200).send(subscription);
    }
});

export default subscriptionRouter;

