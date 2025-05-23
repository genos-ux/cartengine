import { Response, Request } from "express";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Address, User } from "../generated/prisma";
import { prismaClient } from "..";
import { ZodError } from "zod";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
  const validatedAddress = AddressSchema.parse(req.body);

  const user = await prismaClient.user.findFirstOrThrow({
    where: { id: req.user.id },
  });

  const address = await prismaClient.address.create({
    data: {
      ...validatedAddress,
      userId: user.id,
    },
  });

  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id
      }
    })
  
    res.json('Address deleted.');
  } catch (error) {
    throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND);
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id
    }
  });
  res.json(addresses);
};

export const updateUser = async(req:Request, res: Response) => {
  const validatedData = updateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;

  if(validatedData.defaultShippingAddress){

    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress
        },
      });
      if(shippingAddress.userId != req.user.id){
        throw new BadRequestsException('Address does not belong to user.', ErrorCode.ADDRESS_DOES_NOT_BELONG)
      }
    } catch (error) {
      throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND);
    }

  }

  if(validatedData.defaultBillingAddress){
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress
        }
      })

      if (billingAddress.userId != req.user.id) {
        throw new BadRequestsException(
          "Address does not belong to user.",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
      
    }
  }

  
}
