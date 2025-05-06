"use client"

import { getOrderById } from "@/actions/orders/actions/get"
import { ProductsTable } from "@/components/global/tables/productsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversationDrawer } from "@app/(private)/(private supplier)/dashboard/customers/conversationDrawer"
import { Download } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function profilPage() {
  const [order, setOrder] = useState<any>()
  const { orderId } = useParams()

  const getOrder = async () => {
    const result = await getOrderById({orderId: orderId as string})
    if (result?.data?.success) {
      setOrder(result.data.order)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  if (!order) {
    return <p>Chargement...</p>
  }

  return (
    <div>
      <div className="flex gap-4 flex-col-reverse md:flex-row">
        <div className="flex-1 flex flex-col gap-4">
          {order.suppliers.map((sup:any, index:number) => (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{sup.supplier.name}</CardTitle>
                    <CardDescription>
                      Total {sup.products.reduce((acc:any, t:any) => acc + t.price, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <ConversationDrawer receipt={sup.supplier.members[0].user} />
                    <Button size="icon" variant="outline">
                      <Download />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProductsTable propsData={sup.products} viewOnly />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-80">
          <Card className="sticky top-0 bg-secondary-300">
            <CardHeader>
              <CardTitle>Commande {order.ref}</CardTitle>
              <CardDescription>Effectuée le {order.createdAt.toLocaleDateString("fr-FR")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-3">
                {order.suppliers.map((sup:any, index:number) => (
                  <li className="flex justify-between items-center font-bold text-gray-400 mb-1">
                    <p className="text-xs">{sup.supplier.name}</p>
                    <p className="text-xs">
                      {sup.products.reduce((acc:any, t:any) => acc + t.price, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€ HT'}
                    </p>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-sm text-gray-500">Total HT</p>
                <p className="font-bold text-md">
                  {order.suppliers
                    .flatMap((s: any) => s.products)
                    .reduce((acc: number, p: any) => acc + p.price, 0)
                    .toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + "€ HT"}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-sm text-gray-500">Total TTC</p>
                <p className="font-bold text-md">
                  {order.suppliers
                    .flatMap((s: any) => s.products)
                    .reduce((acc: number, p: any) => acc + p.price, 0)
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