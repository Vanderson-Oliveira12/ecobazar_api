import express from 'express';

import FeedbackController from '../Controllers/FeebackController';


export const FeedbackRoutes = express.Router();

FeedbackRoutes.get("/customer/feedbacks", FeedbackController.getRandomFeedbacks);
FeedbackRoutes.post("/customer/:customerId/product/:productId/feedback", FeedbackController.setFeedbackCustomerInProduct);
