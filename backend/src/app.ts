import express from 'express';
import cors from 'cors';
import * as middleware from '@/utils/middleware';
import config from './utils/config';
import clerkRouter from '@/controllers/clerk/clerkController';
import { clerkMiddleware } from '@clerk/express';
import videoRouter from '@/controllers/video/videoController';
import serverRouter from '@/controllers/server-status/serverController';
import subscriptionRouter from '@/controllers/stripe/subscriptionController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
if (config.ENVIRONMENT !== "production") app.use(middleware.requestLogger);

app.use('/api/webhooks', clerkRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/video', videoRouter)
app.use("/", serverRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler)

export default app;
