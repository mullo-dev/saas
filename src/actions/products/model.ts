import { z } from "zod"

export type productType = {
  id?: string,
  ref: string,
  name: string,
  price: number,
  catalogueId: string,
  description: string,
  enabled: boolean,
  unit: string,
  categories: string[],
  tvaValue: number,
  sellQuantity: number
}

export const productModel = {
  ref: z.string(),
  name: z.string().min(3),
  price: z.number(),
  catalogueId: z.string().min(1),
  description: z.string(),
  enabled: z.boolean().default(true),
  unit: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tvaValue: z.number(),
  sellQuantity: z.number().default(1)
}

export const productModelUpdate = {
  ref: z.string().optional(),
  name: z.string().min(3).optional(),
  price: z.number().optional(),
  catalogueId: z.string().min(1).optional(),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  unit: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tvaValue: z.number().optional(),
  sellQuantity: z.number().optional()
}

export const selectProductModel = z.object({
  id: z.string().optional(),
  price: z.number(),
  productId: z.string().min(1, "Product is required")
})