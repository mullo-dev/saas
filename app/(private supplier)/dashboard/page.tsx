"use client"

import OrganizationCard from "./organizationCard"
import CatalogueSection from "./catalogues/catalogueSection"
import { authClient } from "@/lib/auth-client"
import { Suspense } from "react"

export default function DashboardPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations()

  if (isPending) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex gap-6">
      <div className="w-sm">
        <Suspense fallback={<p>Chargement...</p>}>
          <OrganizationCard organizations={organizations} />
        </Suspense>
      </div>
      <div className="flex-1">
        <Suspense fallback={<p>Chargement...</p>}>
          <CatalogueSection organizations={organizations} />
        </Suspense>
      </div>
    </div>
  )

}