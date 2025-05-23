import { Router } from "express";
import authRoute from "./auth";
import productsRoute from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";

const rootRouter:Router = Router();

rootRouter.use(authRoute);
rootRouter.use(productsRoute);
rootRouter.use(userRoutes);
rootRouter.use(cartRoutes);

export default rootRouter;