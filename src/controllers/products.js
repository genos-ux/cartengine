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
exports.searchProducts = exports.getProductById = exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const __1 = require("..");
const products_1 = require("../schema/products");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const prisma_1 = require("../generated/prisma");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a validator to for this request.
    const validatedProduct = products_1.createProductsSchema.parse(req.body);
    const product = yield __1.prismaClient.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(',') })
    });
    res.json(product);
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const updatedProduct = yield __1.prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        });
        return res.json(updatedProduct);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Product not found.', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.product.delete({
            where: {
                id: +req.params.id,
            },
        });
        return res.status(200).json("Product successfully deleted.");
    }
    catch (error) {
        if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            throw new notFound_1.NotFoundException("Product not found.", root_1.ErrorCode.PRODUCT_NOT_FOUND);
        }
        throw error;
    }
});
exports.deleteProduct = deleteProduct;
const listProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // {
    //     count: 100,
    //     data: []
    // }
    // First get the count
    const count = yield __1.prismaClient.product.count();
    const products = yield __1.prismaClient.product.findMany({
        skip: +req.query.skip || 0,
        take: 5
    });
    res.json({
        count, data: products
    });
});
exports.listProducts = listProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });
        res.json(product);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Product not found.', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.getProductById = getProductById;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination here.
    var _a, _b, _c;
    const products = yield __1.prismaClient.product.findMany({
        where: {
            name: {
                search: (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString()
            },
            description: {
                search: (_b = req.query.q) === null || _b === void 0 ? void 0 : _b.toString()
            },
            tags: {
                search: (_c = req.query.q) === null || _c === void 0 ? void 0 : _c.toString()
            },
        }
    });
    res.json(products);
});
exports.searchProducts = searchProducts;
