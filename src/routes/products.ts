import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct, deleteProduct, getProductById, listProducts, searchProducts, updateProduct } from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";
import { isAuthorised } from "../middlewares/requireRole";


const productsRoute:Router = Router();

productsRoute.post('/',authMiddleware,isAuthorised(['ADMIN']),errorHandler(createProduct));
productsRoute.put(
  "/:id",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(updateProduct)
);
productsRoute.delete(
  "/:id",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(deleteProduct)
);
productsRoute.get('/', authMiddleware, errorHandler(listProducts));
productsRoute.get('/search', authMiddleware, errorHandler(searchProducts));
productsRoute.get('/:id',authMiddleware, errorHandler(getProductById));

export default productsRoute;