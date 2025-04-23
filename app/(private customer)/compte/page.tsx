"use client"

import { authClient } from "@/lib/auth-client"
import SupplierCard from "./supplierCard"
import { useEffect, useState } from "react"
import { returnOnlySuppliers } from "@/actions/user/action"

export default function profilPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations()
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>()
  const [selectSupplier, setSelectSupplier] = useState<any>()

  useEffect(() => {
    const filtered = async () => {
      const result = organizations && await returnOnlySuppliers(organizations.map((org) => ({ id: org.id, slug: org.slug })))
      if (result?.data?.success) {
        setFilteredOrganizations(result?.data?.filteredOrganizations)
      }
    }
    filtered()
  }, [isPending])
  

  if (isPending) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <h2 className="font-bold text-xl">Vos fournisseurs</h2>
      <div className="flex gap-2 mt-5">
        {filteredOrganizations?.map((orga:any, index:number) => (
          <SupplierCard key={index} organization={orga} />
        ))}
      </div>
    </div>
  )

}