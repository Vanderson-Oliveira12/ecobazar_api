import express ,{ Router } from "express";
import OrderController from "../Controllers/OrderController";
import { orderBodyRules } from "../middlewares/rules";
import { handleErrors } from "../middlewares/handleErrors";
import { authAdminRouter, authCustomerRouter } from "../middlewares/auth";

export const OrderRoutes: Router = express.Router();

OrderRoutes.get("/orders", authAdminRouter, OrderController.getAllOrders);
OrderRoutes.get("/orders/customer/:costumerId", authCustomerRouter, OrderController.getOrdersByUser);
OrderRoutes.get("/order/:orderId", authCustomerRouter ,OrderController.getOrderById);
OrderRoutes.post("/order/create", orderBodyRules, handleErrors, authCustomerRouter, OrderController.createOrder.bind(OrderController));

OrderRoutes.get("/orders/status", authCustomerRouter,OrderController.getOrdersByStatus);
OrderRoutes.post("/order/status/payment/update/:orderId", authCustomerRouter,OrderController.changePaymentStatusForOrder);
OrderRoutes.post("/order/status/update/:orderId", authCustomerRouter, OrderController.changeOrderStatus.bind(OrderController));
