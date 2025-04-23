import OrganizationCard from "./organizationCard"
import CatalogueSection from "./catalogues/catalogueSection"
import { Suspense } from "react"
import { CustomerSection } from "./customers/customerSection"
import { getUser } from "@/lib/auth-session"
import { getOrganizationById, passActiveOrganization } from "@/actions/organization/actions"

export default async function DashboardPage() {
  const { activeOrganizationId } = await getUser()
  
  if (!activeOrganizationId) {
    await passActiveOrganization({})
    return <p>Chargement...</p>
  }
  
  const org = await getOrganizationById({organizationId: activeOrganizationId})

  return (
    <div className="flex gap-6">
      <div className="w-sm">
        <Suspense fallback={<p>Chargement...</p>}>
          <OrganizationCard organization={org?.data?.organization} />
        </Suspense>
      </div>
      <div className="flex-1">
        <Suspense fallback={<p>Chargement...</p>}>
          <CatalogueSection organizationId={activeOrganizationId} />
        </Suspense>
        <Suspense fallback={<p>Chargement...</p>}>
          <CustomerSection organization={org?.data?.organization} />
        </Suspense>
      </div>
    </div>
  )

}