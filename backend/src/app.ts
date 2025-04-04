import express from 'express';
import cors from 'cors';
import * as middleware from '@/utils/middleware';
import config from './utils/config';
import helmet from "helmet"
import clerkRouter from '@/controllers/clerk/clerkController';
import { clerkMiddleware } from '@clerk/express';
import videoRouter from '@/controllers/video/videoController';
import serverRouter from '@/controllers/server-status/serverController';
import stripeRouter from '@/controllers/stripe/stripeController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(helmet())

if (config.ENVIRONMENT !== "production") app.use(middleware.requestLogger);

app.use('/api/clerk', clerkRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/video', videoRouter)
app.use("/", serverRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler)

export default app;
