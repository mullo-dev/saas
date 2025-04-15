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
  name: z.string(),
  price: z.number(),
  catalogueId: z.string(),
  description: z.string()
}