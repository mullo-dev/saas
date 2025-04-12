import { DrawerDialog } from "@/components/global/modal"
import OrganizationCard from "./organizationCard"
import { getUser } from "@/lib/auth-session"
import { prisma } from "@/lib/prisma"

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
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-md">Vos catalogues</h4>
          {/* <DrawerDialog 
            title="Nouveau catalogue" 
            buttonTitle="ajouter"
            description="Ajoutez un catalogue"
          >
            <p>salut</p>
          </DrawerDialog> */}
        </div>
      </div>
    </div>
  )

}