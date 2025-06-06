"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const errorHandler_1 = require("../errorHandler");
const orders_1 = require("../controllers/orders");
const requireRole_1 = require("../middlewares/requireRole");
const orderRoute = (0, express_1.Router)();
orderRoute.post("/", [auth_1.authMiddleware], (0, errorHandler_1.errorHandler)(orders_1.createOrder));
orderRoute.get("/", [auth_1.authMiddleware], (0, errorHandler_1.errorHandler)(orders_1.listOrders));
orderRoute.put("/:id/cancel", [auth_1.authMiddleware], (0, errorHandler_1.errorHandler)(orders_1.cancelOrder));
orderRoute.get("/index", auth_1.authMiddleware, (0, requireRole_1.isAuthorised)(["ADMIN"]), (0, errorHandler_1.errorHandler)(orders_1.listAllOrders));
orderRoute.get("/users/:id", auth_1.authMiddleware, (0, requireRole_1.isAuthorised)(["ADMIN"]), (0, errorHandler_1.errorHandler)(orders_1.listUserOrders));
orderRoute.put("/:id/status", auth_1.authMiddleware, (0, requireRole_1.isAuthorised)(["ADMIN"]), (0, errorHandler_1.errorHandler)(orders_1.changeStatus));
orderRoute.get("/:id", auth_1.authMiddleware, (0, errorHandler_1.errorHandler)(orders_1.getOrderById));
exports.default = orderRoute;
