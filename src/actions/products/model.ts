import { z } from "zod"

export type productType = {
  id?: string,
  ref: string,
  name: string,
  price: number,
  catalogueId: string,
  description: string
}

export const productModel = {
  ref: z.string(),
  name: z.string().min(1),
  price: z.number(),
  catalogueId: z.string().min(1),
  description: z.string()
}

export const selectProductModel = z.object({
  id: z.string().optional(),
  price: z.number(),
  productId: z.string().min(1, "Product is required")
})