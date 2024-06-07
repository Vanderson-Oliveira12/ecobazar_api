
import express, { Router } from "express";
import { handleUpload } from "../middlewares/uploads";
import CategoryController from "../Controllers/CategoryController";
import { authAdminRouter } from "../middlewares/auth";

export const CategoryRoutes: Router = express.Router();

CategoryRoutes.get("/categories",CategoryController.listCategories);
CategoryRoutes.post("/category/create", authAdminRouter ,handleUpload('categories').single('image') ,CategoryController.createCategory);
CategoryRoutes.put("/category/update/:categoryId", authAdminRouter ,handleUpload('categories').single('image') , CategoryController.updateCategory);
CategoryRoutes.delete("/category/delete/:categoryId", authAdminRouter ,CategoryController.deleteCategory);