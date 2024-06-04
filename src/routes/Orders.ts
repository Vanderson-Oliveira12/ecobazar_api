import express ,{ Router } from "express";
import OrderController from "../Controllers/OrderController";
import { orderBodyRules } from "../middlewares/rules";
import { handleErrors } from "../middlewares/handleErrors";

export const OrderRoutes: Router = express.Router();

OrderRoutes.get("/orders", OrderController.getAllOrders);
OrderRoutes.get("/orders/customer/:costumerId", OrderController.getOrdersByUser);
OrderRoutes.get("/order/:orderId", OrderController.getOrderById);
OrderRoutes.post("/order/create", orderBodyRules, handleErrors, OrderController.createOrder.bind(OrderController));

OrderRoutes.get("/orders/status", OrderController.getOrdersByStatus);
OrderRoutes.post("/order/status/payment/update/:orderId", OrderController.changePaymentStatusForOrder);
OrderRoutes.post("/order/status/update/:orderId", OrderController.changeOrderStatus.bind(OrderController));
