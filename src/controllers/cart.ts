import { Request, Response } from "express";
import { CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "../generated/prisma";
import { prismaClient } from "..";


export const addItemToCart = async(req:Request, res:Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
    } catch (error) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND);
    }

    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user!.id,
            productId: +req.params.id,
            quantity: validatedData.quantity
        }
    })

    res.json(cart);
}

export const deleteItemFromCart = async(req:Request, res:Response) => {

    try {
        const cart = await prismaClient.cartItem.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json('Cart item deleted.');

    } catch (error) {
    throw new NotFoundException('Cart item not found!', ErrorCode.PRODUCT_NOT_FOUND);
    }

}

export const changeQuantity = async(req:Request, res:Response) => {
    // Check if user is updating its own cart item
    const {quantity} = req.body;

    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity
        }
    })

    res.json(updatedCart);

}

export const getCart = async(req:Request, res:Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user?.id
        },
        include: {
            product: true
        }
        
    })
    res.json(cart);
}

