
import express, { Router } from "express";
import { handleUpload } from "../middlewares/uploads";
import CategoryController from "../Controllers/CategoryController";

export const CategoryRoutes: Router = express.Router();

CategoryRoutes.get("/categories", CategoryController.listCategories);
CategoryRoutes.post("/category/create", handleUpload('categories').single('image') ,CategoryController.createCategory);
CategoryRoutes.put("/category/update/:categoryId", handleUpload('categories').single('image') , CategoryController.updateCategory);
CategoryRoutes.delete("/category/delete/:categoryId", CategoryController.deleteCategory);