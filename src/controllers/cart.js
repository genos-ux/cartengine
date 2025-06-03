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
exports.getCart = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.CreateCartSchema.parse(req.body);
    let product;
    try {
        product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    const cart = yield __1.prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: +req.params.id,
            quantity: validatedData.quantity
        }
    });
    res.json(cart);
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield __1.prismaClient.cartItem.delete({
            where: {
                id: +req.params.id
            }
        });
        res.json('Cart item deleted.');
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Cart item not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user is updating its own cart item
    const { quantity } = req.body;
    const updatedCart = yield __1.prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity
        }
    });
    res.json(updatedCart);
});
exports.changeQuantity = changeQuantity;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield __1.prismaClient.cartItem.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        },
        include: {
            product: true
        }
    });
    res.json(cart);
});
exports.getCart = getCart;
