import { Router } from "express"
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/users"
import { errorHandler } from "../errorHandler"
import { adminMiddleware } from "../middlewares/admin"
import { authMiddleware } from "../middlewares/auth"


const userRoutes:Router = Router();

userRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/address', [authMiddleware], errorHandler(updateUser));
userRoutes.patch('/role/:id', [authMiddleware,adminMiddleware], errorHandler(changeUserRole));
userRoutes.get('/',[authMiddleware,adminMiddleware], errorHandler(listUsers));
userRoutes.get('/:id',[authMiddleware, adminMiddleware], errorHandler(getUserById));


export default userRoutes;