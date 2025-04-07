import { HonoRequest } from "hono";
import config from "@/utils/config";
import { ClerkUserCreatedEvent, ClerkUserUpdatedEvent, ClerkUserDeletedEvent } from "@/types";
import { Webhook } from "svix";
import { PrismaClient } from "@prisma/client";
import clerkClient from "@/clients/clerk";
import { WebhookEvent } from "@clerk/backend";
const prisma = new PrismaClient();

export const authenticateRequest = async (req: HonoRequest) => {
    const signing_secret = config.CLERK_SIGNING_SECRET

    if (!signing_secret) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }

    const wh = new Webhook(signing_secret)

    const headers = req.header()
    const payload = await req.json()

    const svix_id = headers["svix-id"]
    const svix_timestamp = headers["svix-timestamp"]
    const svix_signature = headers["svix-signature"]


    const evt = wh.verify(JSON.stringify(payload),{
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string,
    }) as any

    return evt
}

async function createUser(clerkEvent: ClerkUserCreatedEvent) {

    const time = new Date(clerkEvent.timestamp).toISOString();
    const user = await prisma.user.create({
        data: {
            clerk_user_id: clerkEvent.data.id,
            email: clerkEvent.data.email_addresses[0].email_address,
            full_name: clerkEvent.data.first_name + " " + clerkEvent.data.last_name,
            created_at: time,
            updated_at: time,
        },
    });
    return user;
}

async function updateUser(clerkEvent: ClerkUserUpdatedEvent) {

    const time = new Date(clerkEvent.timestamp).toISOString();
    const user = await prisma.user.update({
        where: {
            clerk_user_id: clerkEvent.data.id,
        },
        data: {
            clerk_user_id: clerkEvent.data.id,
            email: clerkEvent.data.email_addresses[0].email_address,
            full_name: clerkEvent.data.first_name + " " + clerkEvent.data.last_name,
            updated_at: time,
        }
    })
    return user;
}

async function getUser(userId: string) {

const user = await clerkClient.users.getUser(userId);
    if (!user) {
        return;
    }
    return user;
}

async function deleteUser(clerkEvent: ClerkUserDeletedEvent) {

    if (clerkEvent.type !== "user.deleted") {
        throw new Error("Invalid event type")
    }

    const userId = clerkEvent.data.id;

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: {clerk_user_id: userId}, 
    });

    if (!user){
        throw new Error("User not found in database");
    }

    await prisma.user.delete({
        where: {clerk_user_id: userId},
    });

    await clerkClient.users.deleteUser(userId);

    return user;
}

export { createUser, updateUser, getUser, deleteUser };
