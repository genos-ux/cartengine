import { Response, Request } from "express";
import { AddressSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { User } from "../generated/prisma";
import { prismaClient } from "..";
import { ZodError } from "zod";

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
