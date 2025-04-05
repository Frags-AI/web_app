import { Hono, HonoRequest } from "hono";
import { createUser, updateUser, getUser, deleteUser, authenticateRequest } from './clerkHelper';
import { ClerkUserCreatedEvent, ClerkUserUpdatedEvent, ClerkUserDeletedEvent } from '@/types';
import { createStripeUser } from '@/routers/stripe/stripeHelper';
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { AuthObject } from "@clerk/backend";

const clerkRouter = new Hono();
clerkRouter.use(clerkMiddleware())


clerkRouter.post("/", async (c) => {
    const evt = authenticateRequest(c.req)

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        await createUser(evt as ClerkUserCreatedEvent)
        await createStripeUser(id)
    } else if (eventType === 'user.updated') {
        await updateUser(evt as ClerkUserUpdatedEvent)
    } else if (eventType === 'user.deleted') {
        await deleteUser(evt as ClerkUserDeletedEvent)
    } else {
        throw new Error("Invalid event type")
    }

    return c.json({
      success: true,
      message: 'Webhook received',
    }, 200)
});

interface ClerkRequest extends HonoRequest {
    auth: AuthObject
}

clerkRouter.get("/", async (c) => {
    const auth = getAuth(c)
    const user = await getUser(auth?.userId as string)
    return c.json(user, 200)
})

export default clerkRouter