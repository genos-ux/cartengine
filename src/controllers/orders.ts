import { Response, Request } from "express";
import { prismaClient } from "..";

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

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })

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

}
export const cancelOrder = async(req:Request, res: Response) => {

}
export const getOrderById = async(req:Request, res: Response) => {

}
