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
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcjetMiddleware = void 0;
const arcjet_1 = require("../lib/arcjet");
const arcjetMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decision = yield arcjet_1.aj.protect(req, {
            requested: 1, // specifies that each  request consumes 1 token
        });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({
                    error: "Too many Requests",
                });
            }
            else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" });
            }
            else {
                res.status(403).json({ error: "Forbidden" });
            }
            return;
        }
        // check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected." });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
});
exports.arcjetMiddleware = arcjetMiddleware;
