"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordCallbackMiddleware = exports.discordAuthMiddleware = exports.googleCallbackMiddleware = exports.googleAuthMiddleware = exports.authMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const authMiddleware = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.authMiddleware = authMiddleware;
// Start Google OAuth flow
exports.googleAuthMiddleware = passport_1.default.authenticate("google", {
    scope: ["profile", "email"], session: false
});
const googleCallbackMiddleware = (req, res, next) => {
    passport_1.default.authenticate("google", { session: false }, (err, user, info) => {
        if (err || !user)
            return res.redirect("/login?error=OAuthFailed");
        req.user = user;
        next();
    })(req, res, next);
};
exports.googleCallbackMiddleware = googleCallbackMiddleware;
exports.discordAuthMiddleware = passport_1.default.authenticate("discord", {
    scope: ["identify", "email"], session: false
});
const discordCallbackMiddleware = (req, res, next) => {
    passport_1.default.authenticate("discord", { session: false }, (err, user, info) => {
        if (err || !user)
            return res.redirect("/login?error=OAuthFailed");
        req.user = user;
        next();
    })(req, res, next);
};
exports.discordCallbackMiddleware = discordCallbackMiddleware;
