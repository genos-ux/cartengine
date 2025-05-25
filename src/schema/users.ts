import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string(),
})

export const updateUserSchema = z.object({
  name: z.string().nullable(),
  defaultShippingAddress: z.number().nullable(),
  defaultBillingAddress: z.number().nullable()
})