import { Request, Response } from "express";
import { prismaClient } from "..";
import { createProductsSchema } from "../schema/products";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Prisma } from "../generated/prisma";


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
    try {
        const product = req.body;

        if(product.tags){
            product.tags = product.tags.join(',')
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })

        //Inside updateProduct
        console.log("UPDATE product called", req.params.id);

        return res.json(updatedProduct);
        
    } catch (error) {
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const deleteProduct = async(req:Request, res:Response) => {
    try {
      await prismaClient.product.delete({
        where: {
          id: +req.params.id,
        },
      });

      // Inside deleteProduct
      console.log("🔥 DELETE product called:", req.params.id);

      return res.status(200).json("Product successfully deleted.");
    } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ){
            throw new NotFoundException(
              "Product not found.",
              ErrorCode.PRODUCT_NOT_FOUND
            );
        }

        throw error;
          
    }

}

export const listProducts = async(req:Request, res:Response) => {

    // {
    //     count: 100,
    //     data: []
    // }

    // First get the count
    const count = await prismaClient.product.count();

    const products = await prismaClient.product.findMany({
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.json({
        count, data: products
    })

}

export const getProductById = async(req:Request, res:Response) => {

    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product);
        
    } catch (error) {
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND);
    }

}

export const searchProducts = async(req:Request, res:Response) => {

    // pagination here.

    const products = await prismaClient.product.findMany({
        where: {
            name: {
                search: req.query.q?.toString()
            },
            description: {
                search: req.query.q?.toString()
            },
            tags: {
                search: req.query.q?.toString()
            },
        }
    })

    res.json(products);
}