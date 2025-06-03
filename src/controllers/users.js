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
exports.getUserById = exports.listUsers = exports.changeUserRole = exports.updateUser = exports.listAddress = exports.deleteAddress = exports.addAddress = void 0;
const users_1 = require("../schema/users");
const notFound_1 = require("../exceptions/notFound");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const bad_requests_1 = require("../exceptions/bad-requests");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validatedAddress = users_1.AddressSchema.parse(req.body);
    const user = yield __1.prismaClient.user.findFirstOrThrow({
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
    });
    const address = yield __1.prismaClient.address.create({
        data: Object.assign(Object.assign({}, validatedAddress), { userId: user.id }),
    });
    res.json(address);
});
exports.addAddress = addAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        });
        res.json('Address deleted.');
    }
    catch (error) {
        throw new notFound_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
});
exports.deleteAddress = deleteAddress;
const listAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const addresses = yield __1.prismaClient.address.findMany({
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    res.json(addresses);
});
exports.listAddress = listAddress;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const validatedData = users_1.updateUserSchema.parse(req.body);
    let shippingAddress;
    let billingAddress;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                },
            });
            if (shippingAddress.userId != ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new bad_requests_1.BadRequestsException('Address does not belong to user.', root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }
        }
        catch (error) {
            throw new notFound_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });
            if (billingAddress.userId != ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
                throw new bad_requests_1.BadRequestsException("Address does not belong to user.", root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }
        }
        catch (error) {
            throw new notFound_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
    }
});
exports.updateUser = updateUser;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validation for changeUserRole.
    const validatedUser = users_1.changeUserRoleSchema.parse(req.body);
    try {
        const user = yield __1.prismaClient.user.update({
            where: {
                id: +req.params.id,
            },
            data: {
                role: validatedUser.role
            }
        });
        res.status(200).json(user);
    }
    catch (error) {
        throw new notFound_1.NotFoundException("User not found.", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.changeUserRole = changeUserRole;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield __1.prismaClient.user.findMany({
        skip: +req.query.skip || 0,
        take: 5
    });
    res.status(200).json(users);
});
exports.listUsers = listUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true
            }
        });
        res.status(200).json(user);
    }
    catch (error) {
        throw new notFound_1.NotFoundException("User not found.", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.getUserById = getUserById;
