import { Router } from "express"
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users"
import { errorHandler } from "../errorHandler"
import { adminMiddleware } from "../middlewares/admin"
import { authMiddleware } from "../middlewares/auth"


const userRoutes:Router = Router();

userRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/', [authMiddleware], errorHandler(updateUser));

export default userRoutes;