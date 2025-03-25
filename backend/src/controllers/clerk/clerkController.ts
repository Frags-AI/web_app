import express, { Request, Response } from 'express';
import { createUser, updateUser, getUser, deleteUser, authenticateRequest } from './clerkHelper';
import { ClerkUserCreatedEvent, ClerkUserUpdatedEvent, ClerkUserDeletedEvent } from '@/types';
import { createStripeUser } from '../stripe/subscriptionHelper';
import { requireAuth, AuthObject } from '@clerk/express';

const clerkRouter = express.Router();

clerkRouter.post("/", async (req: Request, res: Response) => {
    const evt = authenticateRequest(req)

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        await createUser(evt as ClerkUserCreatedEvent)
        await createStripeUser(id)
    } else if (eventType === 'user.updated') {
        await updateUser(evt as ClerkUserUpdatedEvent)
    } else if (eventType === 'user.deleted') {
        await deleteUser(evt as ClerkUserDeletedEvent)
    }

    return void res.status(200).json({
      success: true,
      message: 'Webhook received',
    })
})

clerkRouter.use(requireAuth())

interface ClerkRequest extends Request {
    auth: AuthObject
}

clerkRouter.get("/", async (req: Request, res: Response) => {
    const request = req as ClerkRequest
    const user = await getUser(request.auth.userId as string)
    res.status(200).json(user)
})

export default clerkRouter