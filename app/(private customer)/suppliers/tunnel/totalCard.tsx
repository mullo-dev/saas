"use client"

import { createOrder } from "@/actions/orders/actions/create"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function TotalCard(props:{ suppliers: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const submitOrder = () => {
    startTransition(async () => {
      const response = await createOrder()
      if (response?.data?.success) {
        toast.success("Commande validée")
        router.push(`/orders/${response.data.order?.id}`)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent>
        {props.suppliers.map((t:any, index:number) => (
          <p key={index}>{t.supplier.name}-{t.totalPriceHt}</p>
        ))}
        <Button className="w-full" variant="destructive" onClick={() => submitOrder()} disabled={isPending}>
          {isPending ?
            <LoaderCircle className="animate-spin" />
          : "Passer commande"}
        </Button>
      </CardContent>
    </Card>
  )

}