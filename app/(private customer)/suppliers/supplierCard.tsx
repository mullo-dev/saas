"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvitation } from "@/actions/members/actions"
import { toast } from "sonner"
import { ConversationDrawer } from "@app/(private supplier)/dashboard/customers/conversationDrawer"
import { Button } from "@/components/ui/button"
import { CsvImporter } from "@/components/csv-importer/csv-importer"
import { getOrganizationCatalogue } from "@/actions/catalogue/actions"
import { createProducts } from "@/actions/products/actions"

export default function SupplierCard(props: { organization: any, selectSupplierId: (id:string) => void, isSelected: boolean }) {

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

  const toUploadData = async (parsedData:any) => {
    const catalogues = await getOrganizationCatalogue({ organizationId: props.organization.id })

    if (!catalogues?.data?.catalogues) throw new Error("Catlogue not found")
    const theCatalogue = catalogues?.data?.catalogues[0].id
    const formattedData = parsedData.map((item:any) => ({
        ref: String(item.chooseRef ?? ""),
        name: String(item.chooseName ?? ""),
        description: String(item.chooseDescription ?? ""),
        price: Number.isNaN(Number(item.choosePrice))
          ? 0
          : Number(item.choosePrice),
        catalogueId: String(theCatalogue)
      })
    )

    const result = await createProducts({products: formattedData, createByCustomer: true})
    if (result?.data?.success) {
      toast.success("Produits importés !")
      // props.reload()
    } else {
      toast.success("Une erreur est survenue...")
      console.log(result?.data?.error)
    }
  }

  if (!props.organization) {
    return <p>Chargement...</p>
  }

  return ( 
    <Card 
      className={`flex w-80 cursor-pointer ${props.organization.invit ? "opacity-50 hover:opacity-80 transition-all" : "hover:bg-gray-200"} ${props.isSelected && "bg-gray-100"}`}
      // onClick={() => props.selectSupplierId(props.organization.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3>
            {props.organization.name}
          </h3>
        </CardTitle>
        <CardDescription>
          {props.organization.slug}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.organization.invit ? 
          <p>Invité : 
            <Button onClick={() => props.organization.invit && invitationValidation()} className="font-italic text-orange-400">Accepter l'invitation</Button>
          </p>
        : 
          props.organization.members[0] ? 
            <div>
              <ConversationDrawer receipt={props.organization.members[0].user} />
            </div>
          :
            <CsvImporter
              fields={[
                { label: "Référence", value: "chooseRef", required: true },
                { label: "Name", value: "chooseName", required: true },
                { label: "Description", value: "chooseDescription" },
                { label: "Prix", value: "choosePrice", required: true }
              ]}
              onImport={(parsedData) => toUploadData(parsedData)}
              className="self-end"
            />
        }
      </CardContent>
    </Card>
  )

}