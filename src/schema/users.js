"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRoleSchema = exports.updateUserSchema = exports.AddressSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(4, { message: "Password must be at least 6 characters long" }),
    role: zod_1.z.enum(["USER", "ADMIN"]).default("USER"),
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string(),
    lineTwo: zod_1.z.string().nullable(),
    pincode: zod_1.z.string().length(6),
    country: zod_1.z.string(),
    city: zod_1.z.string(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().nullable(),
    defaultShippingAddress: zod_1.z.number().nullable(),
    defaultBillingAddress: zod_1.z.number().nullable()
});
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"])
});
