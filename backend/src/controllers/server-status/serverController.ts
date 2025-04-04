import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const serverRouter = express.Router();

serverRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running and can execute get requests" });
});

serverRouter.post("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running and can execute post requests" });
})

serverRouter.put("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running and can execute put requests" });
})

serverRouter.delete("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running and can execute delete requests" });
})

serverRouter.patch("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running and can execute patch requests" });
})

export default serverRouter

