import express from 'express';
import ProductController from '../Controllers/ProductController';
import { handleUpload } from '../middlewares/uploads';
import { authAdminRouter } from '../middlewares/auth';


export const ProductRoutes = express.Router();

ProductRoutes.get("/products", ProductController.listAllProducts);
ProductRoutes.get("/products/pagination", ProductController.getProductsByPagination);
ProductRoutes.get("/products/category/:categoryId", ProductController.listProductsByCategory);
ProductRoutes.get("/product/:productId", ProductController.getProductById);
ProductRoutes.get("/product/search", ProductController.getProductBySearch);
ProductRoutes.post("/product/create", authAdminRouter, handleUpload('products').single('image') ,ProductController.createProduct);
ProductRoutes.put("/product/update/:productId",  authAdminRouter, handleUpload('products').single('image'), ProductController.updateProduct);
ProductRoutes.delete("/product/delete/:productId", authAdminRouter, ProductController.deleteProduct);