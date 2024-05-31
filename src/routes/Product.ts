import express from 'express';
import ProductController from '../Controllers/ProductController';
import { handleUpload } from '../middlewares/uploads';
import { authUserInRoute } from '../middlewares/auth';


export const ProductRoutes = express.Router();


ProductRoutes.get("/products", authUserInRoute ,ProductController.listAllProducts);
ProductRoutes.get("/products/category/:categoryId", ProductController.listProductsByCategory);
ProductRoutes.get("/product/:productId", ProductController.getProductById);
ProductRoutes.get("/product/search", ProductController.getProductBySearch);
ProductRoutes.post("/product/create", authUserInRoute, handleUpload('products').single('image') ,ProductController.createProduct);
ProductRoutes.put("/product/update/:productId",  authUserInRoute, handleUpload('products').single('image') ,ProductController.updateProduct);
ProductRoutes.delete("/product/delete/:productId", authUserInRoute, ProductController.deleteProduct);