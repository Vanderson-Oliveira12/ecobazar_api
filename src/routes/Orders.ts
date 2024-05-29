import express ,{ Router } from "express";
import OrderController from "../Controllers/OrderController";

export const OrderRoutes: Router = express.Router();

OrderRoutes.get("/orders", OrderController.getAllOrders);
OrderRoutes.get("/orders/status", OrderController.getOrdersByStatus);
OrderRoutes.post("/order/create", OrderController.createOrder);