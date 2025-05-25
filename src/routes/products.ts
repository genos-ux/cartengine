import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

const productsRoute:Router = Router();

productsRoute.post('/',[authMiddleware, adminMiddleware],errorHandler(createProduct));
productsRoute.put('/:id',[authMiddleware,adminMiddleware], errorHandler(updateProduct));
productsRoute.delete('/:id',[authMiddleware,adminMiddleware], errorHandler(deleteProduct));
productsRoute.get('/', [authMiddleware], errorHandler(listProducts));
productsRoute.get('/:id',[authMiddleware], errorHandler(getProductById));

export default productsRoute;