import { Response, Request } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { PrismaClientRustPanicError } from "../generated/prisma/runtime/library";

export const createOrder = async(req:Request,res:Response) => {
    //Create a transaction
    return await prismaClient.$transaction(async(tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })

        if(cartItems.length == 0){
            return res.json({message: "cart is empty."});
        }

        const price = cartItems.reduce((prev, current) => {
            return prev+ (current.quantity * +current.product.price)
        },0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address?.formattedAddress ?? "no address provided",
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }

            }
        })

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })

        // await tx.cartItem.deleteMany({
        //     where: {
        //         userId: req.user.id
        //     }
        // })

        return res.json(order);


    })
    // List all the cart items and proceed if cart is not empty
    // calculate the total amount
    // retrieve address of user.
    // define computed field for formated address on address model
    // create order and order products
    // create event
    // to empty the cart
}

export const listOrders = async(req:Request, res: Response) => {

    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        }
    })

    res.status(200).json(orders);

}
export const cancelOrder = async(req:Request, res: Response) => {

    // wrap it inside transaction
    // check if the users is cancelling its own order.

    try {
        const orderCancel = await prismaClient.order.update({
            where: {
                id: +req.params.id,
                userId: req.user.id
            },
            data: {
                status: 'CANCELLED'
            }
        })

        await prismaClient.orderEvent.create({
            data: {
                orderId: orderCancel.id,
                status: 'CANCELLED'
            }
        })

        res.status(200).json(orderCancel);
    } catch (error) {
        throw new NotFoundException('Order not found.', ErrorCode.ORDER_NOT_FOUND);
    }

}
export const getOrderById = async(req:Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirst({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })

        return res.status(200).json(order);
        
    } catch (error) {
        throw new NotFoundException('Order not found.', ErrorCode.ORDER_NOT_FOUND)
    }
}

// admin-controlled

export const listAllOrders = async(req:Request, res: Response) => {
    let whereClause = {}
    const status = req.query.status
    if(status) {
        whereClause = {
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.status(200).json(orders);

}

export const changeStatus = async(req:Request, res: Response) => {
    // wrap this inside transaction
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        })

        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })

        return res.status(200).json(order);
        
    } catch (error) {
        throw new NotFoundException('Order not found.', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listUserOrders = async(req:Request, res:Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where:{
                userId: +req.params.id
            }
        })
    
        res.json(order);
    } catch (error) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND);
    }
}

