"use client"

import { addToCart } from "@/actions/cart/action"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Minus, Plus } from "lucide-react"


export function MinProductsTable(props: { propsData: any, supplierId: string, getCartProducts: () => void }) {
  const addOrRemoveProduct = async (data:any, quantity?: number) => {
    await addToCart(data.id, props.supplierId, quantity ? quantity : 1, data.price/data.quantity)
    props.getCartProducts()
  }

  return (
    <div className="rounded-md border flex-1 bg-white">
      <Table>
        <TableHeader className="top-0 sticky">
          <TableRow className="bg-muted/50">
            <TableHead className="hidden lg:table-cell">Référence</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead className="text-right">Quantité</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.propsData?.map((item:any, index:number) => (
            <TableRow key={index}>
              <TableCell className="text-sm max-w-20 truncate hidden lg:table-cell">
                {item.ref}
              </TableCell>
              <TableCell className="max-w-80 text-sm flex">
                {item.name}
              </TableCell>
              <TableCell className="text-sm">
                {(item.priceHt/item.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
              </TableCell>
              <TableCell className="text-sm text-right">
                <div className="flex gap-2 items-center justify-end">
                  <Button size="icon" variant="outline" onClick={() => addOrRemoveProduct(item, -1)} disabled={item.quantity < 2}>
                    <Minus />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button size="icon" variant="outline" onClick={() => addOrRemoveProduct(item, 1)}>
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-sm text-right">
                {item.priceHt.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
