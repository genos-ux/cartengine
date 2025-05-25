import { Router } from "express"
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users"
import { errorHandler } from "../errorHandler"
import { adminMiddleware } from "../middlewares/admin"
import { authMiddleware } from "../middlewares/auth"


const userRoutes:Router = Router();

userRoutes.post('/', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/', [authMiddleware], errorHandler(updateUser));

export default userRoutes;