import { getCart, setCart } from '@/lib/cart'

export async function addToCart(productId: string, supplierId: string, quantity: number = 1, productPrice: number) {
  let cart = await getCart()

  const existing = cart.find((item) => item.productId === productId)

  if (existing) {
    existing.quantity += quantity
    if (existing.quantity <= 0) {
      cart = cart.filter((c) => c.productId !== productId)
    }
  } else {
    cart.push({ productId, quantity, supplierId, productPrice })
  }

  await setCart(cart)
}
