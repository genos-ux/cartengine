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
import { adminMiddleware } from "../middlewares/admin";

const orderRoute: Router = Router();

orderRoute.post("/", [authMiddleware], errorHandler(createOrder));
orderRoute.get("/", [authMiddleware], errorHandler(listOrders));
orderRoute.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRoute.get(
  "/index",
  [authMiddleware, adminMiddleware],
  errorHandler(listAllOrders)
);
orderRoute.get(
  "/users/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(listUserOrders)
);
orderRoute.put(
  "/:id/status",
  [authMiddleware, adminMiddleware],
  errorHandler(changeStatus)
);
orderRoute.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default orderRoute;
