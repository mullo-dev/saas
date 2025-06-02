"use client"

import { getUsersOrders } from "@/actions/orders/actions/get"
import { Orderstable } from "@/components/global/tables/ordersTable"
import { Suspense, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { usePageTitle } from "@/lib/context/pageTitle"
import { OrderType } from "@/actions/orders/model"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function ordersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const { setTitle } = usePageTitle();
  const [isPending, startTransition] = useTransition();
  
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
    startTransition(async () => {
      getOrders()
    })
  }, [])

  if (isPending) {
    return <Skeleton className="w-full h-80" />
  }
  
  return (
    <div>
      <Suspense fallback={<Skeleton className="w-full h-52" />}>
        {orders.length === 0 ?
          <Card className="mt-2">
            <CardHeader className="text-center">
              <CardTitle>Pas encore de commande</CardTitle>
              <CardDescription className="text-center">Passez commande dès maintenant auprès de vos fournisseurs.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href={"/suppliers"} className={buttonVariants()}>
                Passer une commande  
              </Link>
            </CardFooter>
          </Card>
        :
          <Orderstable orders={orders} />
        }
      </Suspense>
    </div>
  )
}