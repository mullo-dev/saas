"use client" 

import { getOrderBySupplier } from '@/actions/orders/actions/get'
import { Orderstable } from '@/components/global/tables/ordersTable'
import { useUser } from '@/lib/auth-session-client'
import { usePageTitle } from '@/lib/context/pageTitle'
import React, { useEffect, useState } from 'react'

export default function supplierOrderPage() {
  const { isPending, activeOrganizationId } = useUser()
  const [orders, setOrders] = useState<any>()
  const { setTitle } = usePageTitle();

  const fetchOrders = async () => {
    if (activeOrganizationId) {
      const result = await getOrderBySupplier({organizationId: activeOrganizationId})
      console.log(result)
      if (result?.data?.success) {
        setOrders(result.data.orders);
      }
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [isPending])
  
  useEffect(() => {
    setTitle("Commandes");
  }, []);

  return (
    <div>
      <Orderstable orders={orders} supplier />
    </div>
  )
}