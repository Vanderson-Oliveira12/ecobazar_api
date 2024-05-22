import express , { Router, Request, Response } from "express";

import AuthController from "./Controllers/AuthController";
import CategoryController from "./Controllers/CategoryController";
import { handleUpload } from "./middlewares/uploads";
import ProductController from "./Controllers/ProductController";
import FeedbackController from "./Controllers/FeebackController";
import CostumerController from "./Controllers/CostumerController";
import NewsletterController from "./Controllers/NewsletterController";
import { emailBodyRules } from "./middlewares/emailValidator";
import OrderController from "./Controllers/OrderController";


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

routes.get("/customers", CostumerController.getAllCostumers);
routes.get("/customer/:customerId", CostumerController.getCostumerById);
routes.delete("/customer/delete/:customerId", CostumerController.deleteCostumer);


/* Feedback */
routes.get("/customer/feedbacks", FeedbackController.getRandomFeedbacks);
routes.post("/customer/:customerId/product/:productId/feedback", FeedbackController.setFeedbackCustomerInProduct);

/* Newsletter */

routes.get("/newsletter", NewsletterController.getAllEmails);
routes.get("/newsletter/offers", NewsletterController.sendOffersByEmails);
routes.post("/newsletter/register", emailBodyRules, NewsletterController.registerEmailByNewsletter);

/* Orders */

routes.post("/order/create", OrderController.createOrder);
