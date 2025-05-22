import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

const productsRoute:Router = Router();

productsRoute.post('/products',[authMiddleware, adminMiddleware],errorHandler(createProduct));
productsRoute.put('/products/:id',[authMiddleware,adminMiddleware], errorHandler(updateProduct));
productsRoute.delete('/products/:id',[authMiddleware,adminMiddleware], errorHandler(deleteProduct));
productsRoute.get('/products', [authMiddleware,adminMiddleware], errorHandler(listProducts));
productsRoute.get('/products/:id',[authMiddleware,adminMiddleware], errorHandler(getProductById));

export default productsRoute;