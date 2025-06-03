"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
// utils/token.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../config/secrets");
const { JWT_REFRESH_SECRET, JWT_SECRET_KEY } = secrets_1.envDetails;
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET_KEY, {
        expiresIn: "30m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: "1h",
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
