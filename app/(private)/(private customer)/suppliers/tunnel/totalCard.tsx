"use client"

import { createOrder } from "@/actions/orders/actions/create"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function TotalCard(props:{ suppliers: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const returnPrice = () => {
    const priceHt = props.suppliers.reduce((acc:any, sup:any) => acc + sup.totalPriceHt,0)
    const priceTva = props.suppliers.reduce((acc:any, sup:any) => acc + sup.totalTva,0)
    const priceTtc = props.suppliers.reduce((acc:any, sup:any) => acc + sup.totalPriceHt + sup.totalTva,0)

    const array = [
      {type: "totalHt", label: "Total HT", value: priceHt },
      {type: "totalTva", label: "TVA", value: priceTva },
      {type: "totalTtc", label: "Total TTC", value: priceTtc },
    ]
    return array
  }

  const submitOrder = () => {
    const messages = Array.from(props.suppliers.values()).map((supplier:any) => ({
      supplierId: supplier.supplierId,
      message: supplier.message
    }))
    startTransition(async () => {
      const response = await createOrder({messages})
      if (response?.data?.success) {
        toast.success("Commande validée")
        router.push(`/orders/${response.data.order?.id}`)
      }
    })
  }

  return (
    <Card className="bg-primary-300/60 lg:sticky lg:top-5 mt-10">
      <CardHeader>
        <CardTitle className="text-primary-dark">Récapitulatif</CardTitle>
        <CardDescription className="text-primary">Finaliser la commande et valider</CardDescription>
      </CardHeader>
      <CardContent>
        {props.suppliers.map((t:any, index:number) => (
          <div key={index} className="flex justify-between mb-2 text-primary-dark text-sm">
            <p>{t.supplier.name}</p>
            <p className="font-bold">{t.totalPriceHt.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
          </div>
        ))}
        <hr className="border-primary-500" />
        <div className="mt-2 mb-5">
          {returnPrice().map((item, index) => ( // {item.type === "totalHt" ? "HT" : item.type === "totalTtc" ? "TTC" : "" }
            <div key={index} className="flex justify-end gap-2 text-primary-dark text-md mb-1">
              <p>{item.label} :</p>
              <p className="font-bold w-24 text-end text-primary">
                {item.value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
              </p> 
            </div>
          ))}
        </div>
        <Button className="w-full"  onClick={() => submitOrder()} disabled={isPending}>
          {isPending ?
            <LoaderCircle className="animate-spin" />
          : "Suivant"}
        </Button>
      </CardContent>
    </Card>
  )

}