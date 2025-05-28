import { Router } from "express";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from "../controllers/users";
import { errorHandler } from "../errorHandler";
import { isAuthorised } from "../middlewares/requireRole";
import { authMiddleware } from "../middlewares/auth";

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
userRoutes.get("/address", [authMiddleware], errorHandler(listAddress));
userRoutes.put("/address", [authMiddleware], errorHandler(updateUser));
userRoutes.patch(
  "/role/:id",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(changeUserRole)
);
userRoutes.get(
  "/",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(listUsers)
);
userRoutes.get(
  "/:id",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(getUserById)
);

export default userRoutes;
