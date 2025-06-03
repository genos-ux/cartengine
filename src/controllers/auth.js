"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.discordCallbackController = exports.googleCallbackController = exports.refreshToken = exports.login = exports.signup = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
// import {
//   JWT_EXPIRES_IN,
//   JWT_REFRESH_EXPIRES_IN,
//   JWT_REFRESH_SECRET,
//   JWT_SECRET_KEY,
// } from "../config/secrets";
const secrets_1 = require("../config/secrets");
const bad_requests_1 = require("../exceptions/bad-requests");
const root_1 = require("../exceptions/root");
const users_1 = require("../schema/users");
const notFound_1 = require("../exceptions/notFound");
const unauthorized_1 = require("../exceptions/unauthorized");
const token_1 = require("../utils/token");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedUser = users_1.SignupSchema.parse(req.body);
    let user = yield __1.prismaClient.user.findFirst({
        where: { email: validatedUser.email },
    });
    if (user)
        new bad_requests_1.BadRequestsException("User already exists!", root_1.ErrorCode.USER_ALREADY_EXISTS);
    user = yield __1.prismaClient.user.create({
        data: {
            name: validatedUser.name,
            email: validatedUser.email,
            password: (0, bcrypt_1.hashSync)(validatedUser.password, 10),
            role: validatedUser.role,
            provider: "local",
        },
    });
    res.json("User successfully created.");
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (!user || !user.password || user.provider === "google")
        throw new notFound_1.NotFoundException("User not found.", root_1.ErrorCode.USER_NOT_FOUND);
    const isPasswordCorrect = (0, bcrypt_1.compareSync)(password, user.password);
    if (!isPasswordCorrect) {
        throw new bad_requests_1.BadRequestsException("Incorrect password", root_1.ErrorCode.INCORRECT_PASSWORD);
    }
    const { accessToken, refreshToken } = (0, token_1.generateTokens)(user);
    yield __1.prismaClient.userRefreshTokens.create({
        data: {
            refreshToken,
            userId: user.id,
        },
    });
    return res.status(200).json({
        id: user.id,
        name: user.name,
        role: user.role,
        accessToken,
        refreshToken,
    });
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { JWT_REFRESH_SECRET, JWT_SECRET_KEY } = secrets_1.envDetails;
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found." });
        }
        const decodedRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = yield __1.prismaClient.user.findFirst({
            where: {
                id: decodedRefreshToken.userId
            }
        });
        const userRefreshToken = yield __1.prismaClient.userRefreshTokens.findFirstOrThrow({
            where: {
                refreshToken,
                userId: decodedRefreshToken.userId,
            },
        });
        yield __1.prismaClient.userRefreshTokens.delete({
            where: {
                id: userRefreshToken.id,
            },
        });
        const accessToken = jwt.sign({ userId: decodedRefreshToken.userId }, JWT_SECRET_KEY, {
            subject: "accessToken",
            expiresIn: "30s",
        });
        const newRefreshToken = jwt.sign({ userId: decodedRefreshToken.userId }, JWT_REFRESH_SECRET, {
            subject: "refreshToken",
            expiresIn: "2m",
        });
        yield __1.prismaClient.userRefreshTokens.create({
            data: {
                refreshToken: newRefreshToken,
                userId: decodedRefreshToken.userId,
            },
        });
        return res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        throw new unauthorized_1.UnauthorizedException("Refresh token invalid or expired", root_1.ErrorCode.UNAUTHORIZED);
    }
});
exports.refreshToken = refreshToken;
const googleCallbackController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { accessToken, refreshToken } = (0, token_1.generateTokens)(user);
    yield __1.prismaClient.userRefreshTokens.create({
        data: {
            refreshToken,
            userId: user.id,
        },
    });
    // frontend route later
    // res.redirect(`https://yourfrontend.com?accessToken=${accessToken}`);
    res.json({
        message: "Google authentication successful",
        accessToken,
        refreshToken,
        user,
    });
});
exports.googleCallbackController = googleCallbackController;
const discordCallbackController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { accessToken, refreshToken } = (0, token_1.generateTokens)(user);
    yield __1.prismaClient.userRefreshTokens.create({
        data: {
            refreshToken,
            userId: req.user.id
        }
    });
    // res.redirect(`https://haprian-naturals.netlify.app?accessToken=${accessToken}?refreshToken=${refreshToken}`);
    res.json({
        message: "Discord authentication successful",
        accessToken,
        refreshToken,
        user
    });
});
exports.discordCallbackController = discordCallbackController;
// /me -> return the logged in user
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json(req.user);
});
exports.me = me;
