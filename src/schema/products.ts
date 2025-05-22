import {z} from 'zod'

export const createProductsSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.number().positive("Price must be a positive number"),
  tags: z.array(z.string().min(1)).optional(),
});
