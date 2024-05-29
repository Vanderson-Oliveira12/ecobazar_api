import express from 'express';
import CostumerController from '../Controllers/CostumerController';


export const CustomerRoutes = express.Router();

CustomerRoutes.get("/customers", CostumerController.getAllCostumers);
CustomerRoutes.get("/customer/:customerId", CostumerController.getCostumerById);
CustomerRoutes.delete("/customer/delete/:customerId", CostumerController.deleteCostumer);