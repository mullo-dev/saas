"use server"

import { Cart } from '@/actions/cart/model'
import { cookies as getCookies } from 'next/headers'

const CART_COOKIE_NAME = 'cart'

export async function getCart(): Promise<Cart> {
  const cookies = await getCookies()
  const cookie = cookies.get(CART_COOKIE_NAME)
  if (!cookie) return []

  try {
    return JSON.parse(cookie.value)
  } catch {
    return []
  }
}

export async function setCart(cart: Cart): Promise<void> {
  const cookies = await getCookies()
  cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearCart(): Promise<void> {
  const cookies = await getCookies()
  cookies.delete(CART_COOKIE_NAME)
}
