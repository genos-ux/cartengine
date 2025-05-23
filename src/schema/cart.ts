import {z} from "zod"

export const CreateCartSchema = z.object({
    quantity: z.number()
})