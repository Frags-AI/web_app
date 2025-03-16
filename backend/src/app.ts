import express from 'express';
import cors from 'cors';
import * as middleware from '@/utils/middleware';
import subscriptionRouter from '@/controllers/stripe/subscriptionController';
import userManagementRouter from '@/controllers/user/userController';
import { clerkMiddleware } from '@clerk/express';
import videoRouter from '@/controllers/video/videoController';
import serverRouter from '@/controllers/server-status/serverController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(middleware.requestLogger);


app.use('/api/user', userManagementRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/video', videoRouter)
app.use("/", serverRouter);


// Handle unknown endpoints
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler)

export default app;
