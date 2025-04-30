import { z } from "zod"

export type CartItem = {
  productId: string
  quantity: number
  supplierId: string
  productPrice: number
}

export type Cart = CartItem[]

export const CartModel = {
  productId: z.string(),
  quantity: z.number(),
  supplierId: z.string()
}