import { z } from "zod";

const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const ProductsResponseSchema = z.object({
    data: z.array(ProductSchema),
});
