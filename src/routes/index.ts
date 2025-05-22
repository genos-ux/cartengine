import { Router } from "express";
import authRoute from "./auth";
import productsRoute from "./products";

const rootRouter:Router = Router();

rootRouter.use(authRoute);
rootRouter.use(productsRoute);

export default rootRouter;