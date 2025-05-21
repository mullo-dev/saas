"use client"

import { addToCart } from "@/actions/cart/action"
import { Cart } from "@/actions/cart/model"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { clearCart, getCart } from "@/lib/cart"
import { Eye, Minus, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


export function ProductsTable(props: { propsData: any, supplierId?: string[], viewOnly?: boolean }) {
  const [cart, setCart] = useState<Cart>()
  
  const getProductsInCart = async () => {
    const result = await getCart()
    setCart(result)
  }

  useEffect(() => {
    getProductsInCart()
  }, [])
  
  const addOrRemoveProduct = async (data:any, quantity?: number) => {
    await addToCart(data.product.id, data.organizationId, quantity ? quantity : 1, data.price)
    getProductsInCart()
  }

  return (
    // TO DO : mobile view
    <div className="flex flex-col lg:flex-row-reverse gap-4">
      {!props.viewOnly && 
        <div className="lg:w-70">
          <Card className="sticky top-5 bg-secondary-500">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <h3>Panier</h3>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <Button 
                      className="rounded-full" 
                      variant="ghost" 
                      size="icon" 
                      disabled={!cart || cart.length < 1}
                      onClick={() => {
                        clearCart()
                        getProductsInCart()
                      }}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Vider le panier</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                {cart && cart.length > 0 ?
                  <>
                    <p>{new Set(cart.map((p:any) => p.supplierId)).size} fournisseurs</p>
                    <p>{cart.length} produits</p>
                  </>
                : 
                  <p>Votre panier est vide</p>
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <hr />
              <div className="flex justify-between my-3">
                <p className="text-sm font-bold text-gray-500">Total</p>
                <p className="text-sm font-bold">
                  {cart?.reduce((acc: number, p: any) => acc + (p.productPrice*p.quantity), 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + "€ HT"}
                </p>
              </div>
              <Link href="/suppliers/tunnel" className={`w-full ${buttonVariants()}`}>
                Passer commande
              </Link>
            </CardContent>
          </Card>
        </div>
      }
      <div className="rounded-md border flex-1">
        <Table>
          <TableHeader className="top-0 sticky">
            <TableRow className="bg-muted/50">
              {!props.viewOnly &&<TableHead className="hidden lg:table-cell">Fournisseur</TableHead>}
              <TableHead className="hidden lg:table-cell">Référence</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Panier</TableHead>
              {props.viewOnly &&
                <>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Total</TableHead>
                </>
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.propsData?.filter((data:any) => props.supplierId && props.supplierId?.length > 0 ? props.supplierId.includes(data.organizationId) : data).map((item:any, index:number) => {
              const inTheCart = cart?.find((c) => c.productId === item.product.id)

              return (
                <TableRow key={index}>
                  {!props.viewOnly && <TableCell className="max-w-30 truncate text-sm hidden lg:table-cell">{item.supplierName}</TableCell>}
                  <TableCell className="text-sm max-w-20 truncate hidden lg:table-cell">
                    {item.product.ref}
                  </TableCell>
                  <TableCell className="max-w-80 cursor-pointer hover:text-primary text-sm flex items-center gap-2 group">
                    <div className="">
                      <p className="text-wrap font-bold">{item.product.name}</p>
                      <p className="text-xs hidden md:block">{item.product.description}</p>
                    </div>
                    <Eye size={18} className="onHover text-white group-has-hover:text-white-400" />
                  </TableCell>
                  {props.viewOnly &&
                    <>
                      <TableCell className="text-sm">
                        {(item.price/item.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.quantity}
                      </TableCell>
                    </>
                  }
                  <TableCell className="text-sm">
                    {item.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
                  </TableCell>
                  {!props.viewOnly &&
                    <TableCell className="text-right">
                      {inTheCart ? 
                        <div className="flex gap-2 items-center justify-end">
                          <Button size="icon" variant="outline" onClick={() => addOrRemoveProduct(item, -1)}>
                            <Minus />
                          </Button>
                          <span>{inTheCart.quantity}</span>
                          <Button size="icon" variant="outline" onClick={() => addOrRemoveProduct(item, 1)}>
                            <Plus />
                          </Button>
                        </div>
                      :
                        <Button size="sm" onClick={() => addOrRemoveProduct(item)}>
                          Ajouter
                        </Button>
                      }
                    </TableCell>
                  }
                  <TableCell className="text-sm text-right font-bold">
                    {inTheCart && (item.price*inTheCart.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
