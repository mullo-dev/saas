"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryCard(props:{ supplier: any }) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.supplier?.supplier.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{props.supplier.products.length} produits</p>
        <p>Total : {props.supplier?.totalPriceHt?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€ HT</p>
        <ul>
          {props.supplier.fullProducts?.map((p:any,index:number) => (
            <li key={index}>{p.ref} - {p.name} - {p.quantity} - {p.priceHt}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

}