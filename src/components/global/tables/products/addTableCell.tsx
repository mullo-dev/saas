"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { Trash } from "lucide-react";

export function AddTableCell(props: {
  item: any,
  selectCustomer: any,
  selectProducts: any,
  setSelectProducts: (prev:any) => void
}) {
  const isInSubCatalogue = props.selectCustomer?.products?.find((id:any) => id.productId === props.item.id)

  const changePriceOfSubProduct = (price:number) => {
    props.setSelectProducts((prev: any[]) =>
      prev.map((p) =>
        p.productId === props.item.id ? { ...p, price } : p
      )
    );    
  };

  return (
    <TableCell className="max-w-[100px]">
      {props.selectProducts.find((select:any) => select.productId === props.item.id) ?
        <div className="flex gap-2">
          <Input 
            type="number" 
            defaultValue={props.item.price}
            onChange={(e) => changePriceOfSubProduct(Number(e.target.value))}
          />
          <Button
            variant="destructive"
            onClick={() => props.setSelectProducts((prev:any) => prev.filter((p:any) => p.productId !== props.item.id))}
          >
            <Trash />
          </Button>
        </div>
      : isInSubCatalogue ?
        <div className="flex gap-2">
          <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring px-2">        
            <Input 
              type="number"
              className="border-0 focus-visible:ring-0 shadow-none" 
              defaultValue={isInSubCatalogue.price}
              onChange={(e) => changePriceOfSubProduct(Number(e.target.value))}
            />        
            <span className="text-gray-500 font-bold text-xs">  
              Prix proposé       
            </span>      
          </div>
          <Button
            variant="destructive"
            onClick={() => props.setSelectProducts((prev:any) => prev.filter((p:any) => p.productId !== props.item.id))}
          >
            <Trash />
          </Button>
        </div>
      :
        <div className="flex justify-end">
          <Button 
            size="sm"
            variant="secondary"
            onClick={() => props.setSelectProducts((prev:any) => [...prev, { productId: props.item.id, price: props.item.price }])}
          >
            ajouter
          </Button>
        </div>
      }
    </TableCell>
  )
}
