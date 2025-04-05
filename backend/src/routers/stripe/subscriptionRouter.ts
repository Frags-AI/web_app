import { Hono, HonoRequest } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { getStripeUser, createSubscription } from "./stripeHelper";

const subscriptionRouter = new Hono();


subscriptionRouter.post("/", async (c) => {

    const auth = getAuth(c);
    const body = await c.req.json()
    
    const userId = auth?.userId
    const lookupKey: string = body.lookupKey|| null;

    if (!userId) {
        return c.json({ message: "User is not authorized" }, 401);
    } else if (lookupKey === null) { 
        return c.json({ message: "Lookup key is required" }, 400);
    } else {
        const customer = await getStripeUser(auth.userId as string);
        const subscription = await createSubscription(customer, lookupKey);
        return c.json(subscription, 200);
    }
});