import { Router } from "express";
import { login, me, refreshToken, signup } from "../controllers/auth";
import { errorHandler } from "../errorHandler";
import { authMiddleware } from "../middlewares/auth";
import passport from "passport";

const authRoute:Router = Router();

authRoute.post('/signup', errorHandler(signup));

authRoute.post('/login', errorHandler(login));

authRoute.post('/refresh-token', errorHandler(refreshToken));

authRoute.get('/me', authMiddleware, errorHandler(me));

export default authRoute;