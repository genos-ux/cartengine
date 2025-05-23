import { Router } from "express"
import { addAddress, deleteAddress, listAddress } from "../controllers/users"
import { errorHandler } from "../errorHandler"
import { adminMiddleware } from "../middlewares/admin"
import { authMiddleware } from "../middlewares/auth"


const userRoutes:Router = Router();

userRoutes.post('/address', [authMiddleware,adminMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware,adminMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleware, adminMiddleware], errorHandler(listAddress));

export default userRoutes;