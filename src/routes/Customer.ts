import express from 'express';
import CostumerController from '../Controllers/CostumerController';
import { authAdminRouter, authCustomerRouter } from '../middlewares/auth';


export const CustomerRoutes = express.Router();

CustomerRoutes.get("/customers", authAdminRouter ,CostumerController.getAllCostumers);
CustomerRoutes.get("/customer/:customerId", authCustomerRouter ,CostumerController.getCostumerById);
CustomerRoutes.delete("/customer/delete/:customerId", authAdminRouter, CostumerController.deleteCostumer);

CustomerRoutes.post("/customer/:customerId/products/favorites/:productId", authCustomerRouter, CostumerController.saveProductFavoriteInCustomer);
CustomerRoutes.delete("/customer/:customerId/products/favorites/:productId", authCustomerRouter, CostumerController.removeProductInFavoritesListCustomer);