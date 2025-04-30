import { Orderstable } from "@/components/global/table/ordersTable"
import { getUser } from "@/lib/auth-session"
import { prisma } from "@/lib/prisma"
import { Suspense } from "react"

export default async function profilPage() {
  const user = await getUser()
  const orders = await prisma.order.findMany({ 
    where: {customerId: user?.user?.id },
    include: {
      suppliers: {
        select: {
          totalHt: true
        }
      }
    }
  })

  return (
    <div>
      <h1>Vos commandes</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <Orderstable orders={orders} />
      </Suspense>
    </div>
  )
}