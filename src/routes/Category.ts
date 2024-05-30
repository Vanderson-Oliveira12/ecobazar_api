
import express, { Router } from "express";
import { handleUpload } from "../middlewares/uploads";
import CategoryController from "../Controllers/CategoryController";
import { authUserInRoute } from "../middlewares/auth";

export const CategoryRoutes: Router = express.Router();

CategoryRoutes.get("/categories", authUserInRoute,CategoryController.listCategories);
CategoryRoutes.post("/category/create", authUserInRoute ,handleUpload('categories').single('image') ,CategoryController.createCategory);
CategoryRoutes.put("/category/update/:categoryId", authUserInRoute ,handleUpload('categories').single('image') , CategoryController.updateCategory);
CategoryRoutes.delete("/category/delete/:categoryId", authUserInRoute ,CategoryController.deleteCategory);