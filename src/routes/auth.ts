import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandler } from "../errorHandler";
import { authMiddleware } from "../middlewares/auth";

const authRoute:Router = Router();

authRoute.post('/signup', errorHandler(signup));

authRoute.post('/login', errorHandler(login));

authRoute.get('/me', authMiddleware, errorHandler(me));

export default authRoute;