import express from 'express';
import userController from '../controller/user-controller.js';
import shopController from '../controller/shop-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();

userRouter.use(authMiddleware);

// user
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);

// shop
userRouter.post('/api/shops', shopController.create);
userRouter.get('/api/shops/:id', shopController.get);

export { userRouter };
