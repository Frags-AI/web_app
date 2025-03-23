import { NextFunction, Request, Response } from "express";
import { clerkClient, AuthObject } from "@clerk/express";
import logger from "../../utils/logger";
import { PrismaClient } from "@prisma/client";

interface AuthRequest extends Request {
    auth: AuthObject
}

const prisma = new PrismaClient();

async function getCurrentUser(auth: AuthObject | null) {
    try {

        if (!auth?.userId) {
            return logger.error("User not authenticated")
        }

        const user = await clerkClient.users.getUser(auth.userId);
        return user;
    } catch (error) {
        logger.error("Invalid Clerk Session")
        return
    }
}

async function insertUser(sessionId: string, id: string, email: string) {
    logger.info("Inserting user", id, email);
    try {
        return { sessionId, id, email };
    } catch (error) {
        logger.error("Invalid user data")
        return
    }
}

async function createUser(req: Request) {

    const request = req as AuthRequest;

    try {
        // const user = await getCurrentUser(request.auth);
        // if (!user) {
        //     return;
        // }
        // const id = user.id;
        // const email = user?.primaryEmailAddress?.emailAddress || "";
        // const data = await insertUser(request?.auth?.sessionId || "", id, email);
        // return data;

        return { message: "User created" };
    } catch (error) {
        logger.error("Invalid Session")
    }
}

async function updateUserData(req: Request) {

    const request = req as AuthRequest;

    try {
        return { message: "User data updated" };
    }
    catch (error: any) {
        logger.error(error.message)
    }
}

async function getUserData(userId: string) {
    try {
        const user = await clerkClient.users.getUser(userId);
        if (!user) {
            return;
        }
        return user;
    } catch (error) {
        logger.error("Failed to fetch data")
    }
}

async function deleteUser(userId: string) {
    
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

    return { message: "User has been deleted" };
}

export {createUser, updateUserData, getUserData, deleteUser};
