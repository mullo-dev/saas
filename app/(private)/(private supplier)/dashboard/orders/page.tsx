import { getOrderBySupplier } from '@/actions/orders/actions/get'
import { SubHeader } from '@/components/global/header/subHeader'
import { Orderstable } from '@/components/global/tables/ordersTable'
import { getUser } from '@/lib/auth-session'
import React from 'react'

export default async function supplierOrderPage() {
  const user = await getUser()
  if (user.activeOrganizationId) {
    const orders = await getOrderBySupplier({organizationId: user.activeOrganizationId})

    return (
      <div>
        <SubHeader title='Les commandes' />
        <Orderstable orders={orders?.data?.orders} supplier />
      </div>
    )
  } else {
    return <p>Loading...</p>
  }
}