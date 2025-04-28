"use client"

import { addToCart } from "@/actions/cart/action"
import { Cart } from "@/actions/cart/model"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCart } from "@/lib/cart"
import { Minus, Plus } from "lucide-react"
import { useEffect, useState } from "react"


export function ProductsTable(props: { propsData: any, supplierId?: string[], viewOnly?: boolean }) {
  const [cart, setCart] = useState<Cart>()

  console.log(props.propsData)
  
  const getProductsInCart = async () => {
    const result = await getCart()
    setCart(result)
  }

  useEffect(() => {
    getProductsInCart()
  }, [])
  

  const addOrRemoveProduct = async (data:any, quantity?: number) => {
    await addToCart(data.product.id, data.organizationId, quantity ? quantity : 1)
    getProductsInCart()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {!props.viewOnly &&<TableHead>Fournisseur</TableHead>}
            <TableHead>Référence</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix</TableHead>
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
                {!props.viewOnly && <TableCell className="font-medium w-40">
                  <span className="line-clamp-1">{item.supplierName}</span>
                </TableCell>}
                <TableCell className="font-medium w-40">
                  <span className="line-clamp-1">{item.product.ref}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-1">{item.product.name}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-3">{item.product.description}</span>
                </TableCell>
                {props.viewOnly &&
                  <>
                    <TableCell className="max-w-[100px]">
                      <span className="line-clamp-1">{(item.price/item.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span>
                    </TableCell>
                    <TableCell className="max-w-[100px]">
                      <span className="line-clamp-3">{item.quantity}</span>
                    </TableCell>
                  </>
                }
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-1">{item.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€</span>
                </TableCell>
                <TableCell className="w-[50px]">
                  {inTheCart && (item.price*inTheCart.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€'}
                </TableCell>
                {!props.viewOnly &&
                  <TableCell className="text-right w-[150px]">
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
                      <Button onClick={() => addOrRemoveProduct(item)}>
                        Ajouter
                      </Button>
                    }
                  </TableCell>
                }
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
