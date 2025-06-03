"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
// import { Strategy as DiscordStrategy } from "passport-discord";
const passport_discord_1 = require("passport-discord");
const __1 = require("..");
const secrets_1 = require("./secrets");
const { DISCORD_CALLBACK_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = secrets_1.envDetails;
passport_1.default.use(new passport_discord_1.Strategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_CALLBACK_URL,
    scope: ["identify", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("DISCORD PROFILE:", profile);
        const email = profile.email;
        let user = yield __1.prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            user = yield __1.prismaClient.user.create({
                data: {
                    email,
                    name: profile.username,
                    password: "",
                    role: "USER",
                    provider: "discord",
                    // optionally avatar: profile.avatar
                },
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
})));
