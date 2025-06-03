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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.getOrderById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const __1 = require("..");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Create a transaction
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const cartItems = yield tx.cartItem.findMany({
            where: {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            },
            include: {
                product: true
            }
        });
        if (cartItems.length == 0) {
            return res.json({ message: "cart is empty." });
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price);
        }, 0);
        const address = yield tx.address.findFirst({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id
            }
        });
        const order = yield tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: (_c = address === null || address === void 0 ? void 0 : address.formattedAddress) !== null && _c !== void 0 ? _c : "no address provided",
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        };
                    })
                }
            }
        });
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        });
        // await tx.cartItem.deleteMany({
        //     where: {
        //         userId: req.user.id
        //     }
        // })
        return res.json(order);
    }));
    // List all the cart items and proceed if cart is not empty
    // calculate the total amount
    // retrieve address of user.
    // define computed field for formated address on address model
    // create order and order products
    // create event
    // to empty the cart
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orders = yield __1.prismaClient.order.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.status(200).json(orders);
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // wrap it inside transaction
    // check if the users is cancelling its own order.
    var _a;
    try {
        const orderCancel = yield __1.prismaClient.order.update({
            where: {
                id: +req.params.id,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            },
            data: {
                status: 'CANCELLED'
            }
        });
        yield __1.prismaClient.orderEvent.create({
            data: {
                orderId: orderCancel.id,
                status: 'CANCELLED'
            }
        });
        res.status(200).json(orderCancel);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Order not found.', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.findFirst({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        });
        return res.status(200).json(order);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Order not found.', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.getOrderById = getOrderById;
// admin-controlled
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {};
    const status = req.query.status;
    if (status) {
        whereClause = {
            status
        };
    }
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5
    });
    res.status(200).json(orders);
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // wrap this inside transaction
    try {
        const order = yield __1.prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        });
        yield __1.prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        });
        return res.status(200).json(order);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Order not found.', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.findFirstOrThrow({
            where: {
                userId: +req.params.id
            }
        });
        res.json(order);
    }
    catch (error) {
        throw new notFound_1.NotFoundException('User not found.', root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.listUserOrders = listUserOrders;
