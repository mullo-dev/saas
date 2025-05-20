"use client"

import { getUsersOrders } from "@/actions/orders/actions/get"
import { Orderstable } from "@/components/global/tables/ordersTable"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { usePageTitle } from "@/lib/context/pageTitle"
import { OrderType } from "@/actions/orders/model"

export default function ordersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Commandes");
    const getOrders = async () => {
      const result = await getUsersOrders()
      if (result?.data?.success) {
        setOrders(result.data.orders ?? [])
      } else {
        toast.error("Une erreur est survenue")
      }
    }
    getOrders()
  }, [])
  

  return (
    <div>
      <Suspense fallback={<p>Chargement...</p>}>
        <Orderstable orders={orders} />
      </Suspense>
    </div>
  )
}