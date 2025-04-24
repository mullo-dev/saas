"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export function ProductsTable(
  props: { 
    propsData: any
  }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Fournisseur</TableHead>
            <TableHead>Référence</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.propsData?.map((item:any, index:number) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium w-40">
                  <span className="line-clamp-1">{item.supplierName}</span>
                </TableCell>
                <TableCell className="font-medium w-40">
                  <span className="line-clamp-1">{item.product.ref}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-1">{item.product.name}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-3">{item.product.description}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-1">{item.price}</span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
