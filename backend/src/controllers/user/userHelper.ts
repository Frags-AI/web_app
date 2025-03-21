import { Request, Response } from "express";
import { clerkClient, AuthObject } from "@clerk/express";
import logger from "../../utils/logger";

interface AuthRequest extends Request {
    auth: AuthObject
}
    

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

async function CreateUser(req: Request) {

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

async function GetUserData(userId: string) {
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

async function deleteUser(req: Request) {
    const request = req as AuthRequest;

    try {
        if (!request.auth?.userId) {
            logger.error("User not authenticated");
            return {success: false, error: "User not authenticated"};

        }
        // Deletet user from Clerk 
        await clerkClient.users.deleteUser(request.auth.userId);

        logger.info("User ${request.auth.userId} deleted successfully");
    } catch (error) {
        logger.error("Failed to delete user:", error);
        return {success:false, error:"Failed to delete user"};
    }
}




export {CreateUser, updateUserData, GetUserData, deleteUser};
