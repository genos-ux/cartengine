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
exports.errorHandler = void 0;
const root_1 = require("./exceptions/root");
const internalException_1 = require("./exceptions/internalException");
const zod_1 = require("zod");
const bad_requests_1 = require("./exceptions/bad-requests");
const jsonwebtoken_1 = require("jsonwebtoken");
const unauthorized_1 = require("./exceptions/unauthorized");
const errorHandler = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.HttpException) {
                exception = error;
            }
            else {
                if (error instanceof zod_1.ZodError) {
                    console.error("Zod Validation Error:", error.errors);
                    const detailedMessage = error.errors
                        .map((e) => `${e.path.join(".")} - ${e.message}`)
                        .join("; ");
                    exception = new bad_requests_1.BadRequestsException(`Validation failed: ${detailedMessage}`, // 👈 include field-level messages
                    root_1.ErrorCode.UNPROCESSABLE_ENTITY);
                }
                else if (error instanceof jsonwebtoken_1.TokenExpiredError ||
                    error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    exception = new unauthorized_1.UnauthorizedException("Token invalid or expired.", root_1.ErrorCode.UNAUTHORIZED);
                }
                else {
                    console.error("Unhandled error:", error);
                    exception = new internalException_1.InternalException("Something went wrong!", error, root_1.ErrorCode.INTERNAL_EXCEPTION);
                }
            }
            next(exception);
        }
    });
};
exports.errorHandler = errorHandler;
