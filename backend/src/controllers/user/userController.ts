import express, { Request, Response } from 'express';
import {CreateUser, updateUserData, GetUserData, deleteUser} from './userHelper';
import { requireAuth, AuthObject } from "@clerk/express";


const userManagementRouter = express.Router();

userManagementRouter.get('/test', (req: Request, res: Response) => {
    res.send("Hello from user management");
});

userManagementRouter.post('/create', (req: Request, res: Response) => {
    const response = CreateUser(req);

    if (response) {
        res.status(200).json(response);
    } else {
        res.status(500).json({ error: "An error occurred" });
    }
});

userManagementRouter.use(requireAuth())

interface AuthRequest extends Request {
    auth: AuthObject
}

userManagementRouter.post('/update', (req: Request, res: Response) => {
    
    const response = updateUserData(req);

    if (response) {
        res.status(200).json(response);
    } else {
        res.status(500).json({ error: "An error occurred" });
    }
});


userManagementRouter.get('/', async (req: Request, res: Response) => {

    const request = req as AuthRequest;

    if (!request.auth.userId) {
        res.status(401).send("User is not authorized");
    }

    const response = await GetUserData(request.auth.userId as string);

    if (response) {
        res.status(200).json(response);
    } else {
        res.status(500).json({ error: "An error occurred" });
    }
});

userManagementRouter.post('/delete', async (req: Request, res: Response) => {
    const request = req as AuthRequest;
    const response = await deleteUser(request?.auth.userId as string);

    if ( response){
        res.status(200).json(response);
    } else {
        res.status(500).json({ error: "An error occurred" });
    }
})

export default userManagementRouter