"use client"

import { getOrderById } from "@/actions/orders/actions/get"
import { SubHeader } from "@/components/global/header/subHeader"
import { ProductsTable } from "@/components/global/tables/productsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/auth-session-client"
import { ConversationDrawer } from "@app/(private)/(private supplier)/dashboard/customers/conversationDrawer"
import { Download } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function supplierOrderIdPage() {
  const [order, setOrder] = useState<any>()
  const { isPending, activeOrganizationId } = useUser()
  const { orderId } = useParams()

  const getOrder = async () => {
    const result = await getOrderById({orderId: orderId as string, organizationId: activeOrganizationId as string })
    console.log(result)
    if (result?.data?.success) {
      setOrder(result.data.order)
    }
  }

  useEffect(() => {
    !isPending && getOrder()
  }, [isPending])

  if (!order) {
    return <p>Chargement...</p>
  }

  return (
    <div>
      <div className="flex gap-4 flex-col-reverse md:flex-row">
        <div className="flex-1">
          <SubHeader title={`Commande ${order.ref}`} />
          <h2 className="font-bold text-md mb-2">
            {order.suppliers[0].products.length} produit{order.suppliers[0].products.length > 1 && "s"}</h2>
          <ProductsTable propsData={order.suppliers[0].products} viewOnly />
        </div>
        <div className="w-80">
          <Card className="sticky top-5 bg-secondary-300">
            <CardHeader>
              <CardTitle>Commande {order.ref}</CardTitle>
              <CardDescription>Effectuée le {order.createdAt.toLocaleDateString("fr-FR")}</CardDescription>
              <hr />
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-5">
                <h3 className="font-bold mb-2">Client</h3>
                <div className="flex justify-between">
                  <p>
                    {order.customer.name}<br/>
                    <span className="text-muted-foreground">{order.customer.email}</span>
                  </p>
                  <ConversationDrawer receipt={order.customer} />
                </div>
              </div>
              <hr />
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-sm text-gray-500">Total HT</p>
                <p className="font-bold text-md">
                  {order.suppliers[0].totalHt
                    .toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + "€ HT"}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-sm text-gray-500">Total TTC</p>
                <p className="font-bold text-md">
                  {order.suppliers
                    .flatMap((s: any) => s.products)
                    .reduce((acc: number, p: any) => acc + p.price + (p.price*p.tvaValue), 0)
                    .toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + "€ TTC"}
                </p>
              </div>
              <Button className="w-full mt-4">
                {/* TO DO */}
                Bons de livraison <Download /> 
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}