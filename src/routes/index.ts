import { Router } from "express";
import authRoute from "./auth";
import productsRoute from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import orderRoute from "./orders";

const rootRouter:Router = Router();

rootRouter.use(authRoute);
rootRouter.use('/products',productsRoute);
rootRouter.use('/address',userRoutes);
rootRouter.use('/carts',cartRoutes);
rootRouter.use('/orders/',orderRoute);

export default rootRouter;