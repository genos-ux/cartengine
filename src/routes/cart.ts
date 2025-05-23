import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";


const cartRoutes:Router = Router();

cartRoutes.post('/cart/:id', [authMiddleware], errorHandler(addItemToCart));
cartRoutes.get('/cart', [authMiddleware], errorHandler(getCart));
cartRoutes.delete('/cart/:id', [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put('/cart/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes;