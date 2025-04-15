import OrganizationCard from "./organizationCard"
import { getUser } from "@/lib/auth-session"
import { prisma } from "@/lib/prisma"
import CatalogueSection from "./catalogues/catalogueSection"

export default async function DashboardPage() {
  const user = await getUser()
  const theUser = await prisma.user.findUnique({
    where: {id: user?.id},
    include: { 
      organizations: {
        include: {
          organization: {
            select: {
              id: true,
              catalogues: {
                select: {
                  id: true
                }
              }
            },
          }
        }
      } 
    },
  })

  return (
    <div className="flex gap-6">
      <div className="w-sm">
        <OrganizationCard organizationId={theUser?.organizations[0]?.organizationId} />
      </div>
      <div className="flex-1">
        <CatalogueSection organization={theUser?.organizations[0]?.organization} />
      </div>
    </div>
  )

}