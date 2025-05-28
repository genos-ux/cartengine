import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  listAllOrders,
  listOrders,
  listUserOrders,
} from "../controllers/orders";
import { isAuthorised } from "../middlewares/requireRole";

const orderRoute: Router = Router();

orderRoute.post("/", [authMiddleware], errorHandler(createOrder));
orderRoute.get("/", [authMiddleware], errorHandler(listOrders));
orderRoute.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRoute.get(
  "/index",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(listAllOrders)
);
orderRoute.get(
  "/users/:id",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(listUserOrders)
);
orderRoute.put(
  "/:id/status",
  authMiddleware,
  isAuthorised(["ADMIN"]),
  errorHandler(changeStatus)
);
orderRoute.get("/:id", authMiddleware, errorHandler(getOrderById));

export default orderRoute;
