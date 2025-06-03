"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envDetails = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
// export const PORT = process.env.PORT || 3000
// export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!
// export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
// export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
// export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
exports.envDetails = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    DISCORD_CALLBACK_URL: process.env.DISCORD_CALLBACK_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    ARCJET_KEY: process.env.ARCJET_KEY
};
