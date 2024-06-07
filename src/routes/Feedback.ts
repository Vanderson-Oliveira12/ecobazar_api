import express from 'express';

import FeedbackController from '../Controllers/FeebackController';
import { authCustomerRouter } from '../middlewares/auth';


export const FeedbackRoutes = express.Router();

FeedbackRoutes.get("/customer/feedbacks", FeedbackController.getRandomFeedbacks);
FeedbackRoutes.post("/customer/:customerId/product/:productId/feedback", authCustomerRouter,FeedbackController.setFeedbackCustomerInProduct);
