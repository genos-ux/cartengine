import { Router } from "express";
import authRoute from "./auth";
import productsRoute from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import orderRoute from "./orders";

const rootRouter:Router = Router();

rootRouter.use(authRoute);
rootRouter.use(productsRoute);
rootRouter.use(userRoutes);
rootRouter.use(cartRoutes);
rootRouter.use(orderRoute);

export default rootRouter;