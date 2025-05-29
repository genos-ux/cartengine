import { Router } from "express";
import { discordCallbackController, googleCallbackController, login, me, refreshToken, signup } from "../controllers/auth";
import { errorHandler } from "../errorHandler";
import { authMiddleware, discordAuthMiddleware, googleAuthMiddleware, googleCallbackMiddleware } from "../middlewares/auth";

const authRoute:Router = Router();

authRoute.post('/signup', errorHandler(signup));

authRoute.post('/login', errorHandler(login));

authRoute.post('/refresh-token', errorHandler(refreshToken));

// Initiate google login
authRoute.get('/google', googleAuthMiddleware);

// Callback google route
authRoute.get('/google/callback',googleCallbackMiddleware,googleCallbackController);

authRoute.get('/discord', discordAuthMiddleware);
authRoute.get('/discord/callback',discordAuthMiddleware,discordCallbackController);

authRoute.get('/me', authMiddleware, errorHandler(me));

export default authRoute;