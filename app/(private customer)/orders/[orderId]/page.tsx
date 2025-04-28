"use client"

import { getOrderById } from "@/actions/orders/action"
import { ProductsTable } from "@/components/global/table/productsTable"
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
      <h1>Commande numéro {order.ref} du {order.createdAt.toLocaleDateString("fr-FR")}</h1>
      {order.suppliers.map((sup:any, index:number) => (
        <div>
          <h2>{sup.supplier.name}</h2>
          <ProductsTable propsData={sup.products} viewOnly />
          <p>
            Total : {sup.products.reduce((acc:any, t:any) => acc + t.price, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€'}
          </p>
        </div>
      ))}
    </div>
  )
}