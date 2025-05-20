import { Router } from "express";
import authRoute from "./auth";

const rootRouter:Router = Router();

rootRouter.use(authRoute);

export default rootRouter;