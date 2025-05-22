import { Request, Response } from "express";
import { prismaClient } from "..";
import { createProductsSchema } from "../schema/products";


export const createProduct = async(req:Request,res:Response) => {

    // Create a validator to for this request.

    const validatedProduct = createProductsSchema.parse(req.body);
    

    const product = await prismaClient.product.create({
        data: {
            ...req.body, 
            tags : req.body.tags.join(',')
        }
    })

    res.json(product);

}

export const updateProduct = async(req:Request, res: Response) => {

}

export const deleteProduct = async(req:Request, res:Response) => {

}

export const listProducts = async(req:Request, res:Response) => {

}

export const getProductById = async(req:Request, res:Response) => {
    
}