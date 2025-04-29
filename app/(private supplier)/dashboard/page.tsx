import OrganizationCard from "./organizationCard"
import CatalogueSection from "./catalogues/catalogueSection"
import { Suspense } from "react"
import { CustomerSection } from "./customers/customerSection"
import { getUser } from "@/lib/auth-session"
import { getOrganizationById } from "@/actions/organization/actions/get"
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { passActiveOrganization } from "@/actions/organization/actions/active"

export default async function DashboardPage() {
  const { activeOrganizationId } = await getUser()
  let org
  
  if (!activeOrganizationId) {
    const result = await passActiveOrganization({})
    if (result?.data?.success) {
      redirect("/dashboard")
    }
  } else {
    org = await getOrganizationById({organizationId: activeOrganizationId})
  }
  

  return (
    <div className="flex gap-6">
      <div className="w-sm">
        <Suspense fallback={<p>Chargement...</p>}>
          <OrganizationCard organization={activeOrganizationId ? org?.data?.organization : ""} />
        </Suspense>
      </div>
      <div className="flex-1">
        {activeOrganizationId ? 
          <>
            <Suspense fallback={<p>Chargement...</p>}>
              <CatalogueSection organizationId={activeOrganizationId} />
            </Suspense>
            <Suspense fallback={<p>Chargement...</p>}>
              <CustomerSection organization={org?.data?.organization} />
            </Suspense>
          </>
        :
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Vous n'avez pas d'entreprise enregistrée</AlertTitle>
            <AlertDescription>
              Vous devez enregistrer votre organisation avant de pouvoir gérer vos données.
            </AlertDescription>
          </Alert>
        }
      </div>
    </div>
  )

}