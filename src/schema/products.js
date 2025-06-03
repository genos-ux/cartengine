"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductsSchema = void 0;
const zod_1 = require("zod");
exports.createProductsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required."),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters."),
    price: zod_1.z.number().positive("Price must be a positive number"),
    tags: zod_1.z.array(zod_1.z.string().min(1)).optional(),
});
