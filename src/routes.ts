import express , { Router, Request, Response } from "express";

import AuthController from "./Controllers/AuthController";
import CategoryController from "./Controllers/CategoryController";
import { handleUpload } from "./middlewares/uploads";
import ProductController from "./Controllers/ProductController";
import CustomerController from "./Controllers/CustomerController";



export const routes: Router = express.Router();

routes.get("/auth/signin", AuthController.signIn);
routes.post("/auth/signup", AuthController.signUp);
routes.get("/auth/recoveryPassword", AuthController.recoveryPassword);
routes.post("/auth/createNewPassword", AuthController.createNewPassword);

/* Categories */

routes.get("/categories", CategoryController.listCategories);
routes.post("/category/create", handleUpload('categories').single('image') ,CategoryController.createCategory);
routes.put("/category/update/:categoryId", handleUpload('categories').single('image') , CategoryController.updateCategory);
routes.delete("/category/delete/:categoryId", CategoryController.deleteCategory);

/* Products */

routes.get("/products", ProductController.listAllProducts);
routes.get("/products/category/:categoryId", ProductController.listProductsByCategory);
routes.get("/product/:productId", ProductController.getProductById);
routes.get("/product/search", ProductController.getProductBySearch);
routes.post("/product/create", handleUpload('products').single('image') ,ProductController.createProduct);
routes.put("/product/update/:productId", handleUpload('products').single('image') ,ProductController.updateProduct);
routes.delete("/product/delete/:productId", ProductController.deleteProduct);


/* Customers */

routes.get("/customer/feedbacks", CustomerController.getRandomFeedbacks);
routes.post("/customer/feedback/:customerId/:productId", CustomerController.setFeedbackCustomerInProduct);