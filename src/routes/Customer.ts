import express from 'express';
import CostumerController from '../Controllers/CostumerController';
import { authUserInRoute } from '../middlewares/auth';


export const CustomerRoutes = express.Router();

CustomerRoutes.get("/customers", authUserInRoute ,CostumerController.getAllCostumers);
CustomerRoutes.get("/customer/:customerId", authUserInRoute, CostumerController.getCostumerById);
CustomerRoutes.delete("/customer/delete/:customerId", authUserInRoute, CostumerController.deleteCostumer);

CustomerRoutes.post("/customer/:customerId/products/favorites/:productId", authUserInRoute, CostumerController.saveProductFavoriteInCustomer);
CustomerRoutes.delete("/customer/:customerId/products/favorites/:productId", authUserInRoute, CostumerController.removeProductInFavoritesListCustomer);