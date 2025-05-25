import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";


const cartRoutes:Router = Router();

cartRoutes.post('/:id', [authMiddleware], errorHandler(addItemToCart));
cartRoutes.get('/', [authMiddleware], errorHandler(getCart));
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes;