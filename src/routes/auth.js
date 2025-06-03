"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const errorHandler_1 = require("../errorHandler");
const auth_2 = require("../middlewares/auth");
const authRoute = (0, express_1.Router)();
authRoute.post('/signup', (0, errorHandler_1.errorHandler)(auth_1.signup));
authRoute.post('/login', (0, errorHandler_1.errorHandler)(auth_1.login));
authRoute.post('/refresh-token', (0, errorHandler_1.errorHandler)(auth_1.refreshToken));
// Initiate google login
authRoute.get('/google', auth_2.googleAuthMiddleware);
// Callback google route
authRoute.get('/google/callback', auth_2.googleCallbackMiddleware, auth_1.googleCallbackController);
authRoute.get('/discord', auth_2.discordAuthMiddleware);
authRoute.get('/discord/callback', auth_2.discordAuthMiddleware, auth_1.discordCallbackController);
authRoute.get('/me', auth_2.authMiddleware, (0, errorHandler_1.errorHandler)(auth_1.me));
exports.default = authRoute;
