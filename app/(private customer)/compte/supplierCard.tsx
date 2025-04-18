"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getOrganizationInvited } from "@/actions/organization/actions"
import Link from "next/link"
import { acceptInvitation } from "@/actions/members/actions"
import { toast } from "sonner"

export default function SupplierCard(props: { organization: any }) {
  const [organization, setOrganization] = useState<any>()


  useEffect(() => {
    const getOrga = async () => {
      const result = await getOrganizationInvited({organizationSlug: props.organization.slug})
      if (result?.data?.success) {
        setOrganization(result.data.organization)
      }
      console.log(result)
    }
    getOrga()
  }, [])


  const invitationValidation = async () => {
    const confirmed = window.confirm("Es-tu sûr de vouloir accepter cette invitation ?");

    if (!confirmed) return;

    const result = await acceptInvitation({ invitationId: props.organization.invitations[0].id })
    if (result?.data?.success) {
      toast.success("Invitation validée")
    } else (
      toast.success("Une erreur est survenu lors de la validation de l'invitaion")
    )
  }
  

  if (!organization) {
    return <p>Chargement...</p>
  }

  return (
    <Card 
      className={`flex w-80 cursor-pointer ${props.organization.invit ? "opacity-50 hover:opacity-80 transition-all" : "hover:bg-gray-100"}`}
      onClick={() => props.organization.invit ? invitationValidation() : console.log("nop")}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3>
            {organization.name}
          </h3>
        </CardTitle>
        <CardDescription>
          {organization.slug}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.organization.invit ? 
          <p>Invité : <Link href="" className="font-italic text-orange-400">Accepter l'invitation</Link></p>
        : <p>Salut</p>}
      </CardContent>
    </Card>
  )

}