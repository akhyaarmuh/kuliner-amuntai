import express from 'express';
import cookieParser from 'cookie-parser';
import { userRouter } from '../route/api.js';
import { publicRouter } from '../route/public-api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';

export const web = express();

web.use(cookieParser());
web.use(express.json());

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
