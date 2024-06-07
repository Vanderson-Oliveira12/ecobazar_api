import express, { Router, Request, Response } from "express";
import { AuthRoutes } from "./Auth";
import { CategoryRoutes } from "./Category";
import { CustomerRoutes } from "./Customer";
import { FeedbackRoutes } from "./Feedback";
import { NewsletterRoutes } from "./Newsletter";
import { OrderRoutes } from "./Orders";
import { ProductRoutes } from "./Product";

const routes: Router = express.Router();

routes.use(AuthRoutes);
routes.use(CategoryRoutes);
routes.use(ProductRoutes);
routes.use(CustomerRoutes);
routes.use(FeedbackRoutes);
routes.use(NewsletterRoutes);
routes.use(OrderRoutes);

export default routes;
