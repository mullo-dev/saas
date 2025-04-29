"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvitation } from "@/actions/members/actions"
import { toast } from "sonner"
import { ConversationDrawer } from "@app/(private supplier)/dashboard/customers/conversationDrawer"
import { Button } from "@/components/ui/button"
import { CsvImporter } from "@/components/csv-importer/csv-importer"
import { createProducts } from "@/actions/products/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit } from "lucide-react"
import { useState } from "react"

export default function SupplierCard(props: { 
  organization: any, 
  selectSupplierId: (id:string,status:boolean) => void, 
  isSelected: boolean 
  reload: () => void
}) {
  const [returnResult, setReturnResult] = useState<any>()

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
    if (!props.organization.catalogues[0]) throw new Error("Catalogue not found")

    const theCatalogue = props.organization.catalogues[0].id
    const formattedData = parsedData.map((item:any) => {
      return {
      ref: String(item.chooseRef),
      name: String(item.chooseName),
      description: String(item.chooseDescription),
      price: Number.isNaN(Number(item.choosePrice.replace(',', '.')))
        ? 0
        : Number(item.choosePrice.replace(',', '.')),
      catalogueId: String(theCatalogue)
      }
    })

    const result = await createProducts({products: formattedData, createByCustomer: true, catalogueId: theCatalogue})
    if (result?.data?.success) {
      toast.success("Produits importés !")
      setReturnResult(result.data)
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
      className={`
        flex w-80 
        ${props.organization.invit && "opacity-50 hover:opacity-80 transition-all"} 
        ${props.isSelected && "bg-gray-100"}
      `}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3>
            {props.organization.name}
          </h3>
          <Checkbox className="cursor-pointer" onCheckedChange={e => props.selectSupplierId(props.organization.id, e as boolean)} />
        </CardTitle>
        <CardDescription>
          {props.organization.slug}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {props.organization.invit ? // if the invitation isn't accepted yet
          <p>Invité : 
            <Button 
              onClick={() => props.organization.invit && invitationValidation()} 
              className="font-italic text-orange-400"
            >
              Accepter l'invitation
            </Button>
          </p>
        : 
          props.organization.members[0] ? // the supplier is real
            <div>
              <ConversationDrawer receipt={props.organization.members[0].user} />
            </div>
          // the supplier was created by the customer...
          : props.organization.catalogues[0] ? // ...and have a catalogue
            <Button size="icon" variant="outline">
              <Edit />
            </Button>
          : // ...don't have catagloue yet
            <CsvImporter
              fields={[
                { label: "Référence", value: "chooseRef", required: true },
                { label: "Name", value: "chooseName", required: true },
                { label: "Description", value: "chooseDescription" },
                { label: "Prix", value: "choosePrice", required: true }
              ]}
              onImport={(parsedData) => toUploadData(parsedData)}
              reload={props.reload}
              className="self-end"
            >
              <ul>
                <li className="text-sm font-bold">{returnResult?.updated} produits ont été mis à jour.</li>
                <li className="text-sm font-bold">{returnResult?.created} produits ont été créés.</li>
                {returnResult?.failed > 0 && <li className="text-sm font-bold text-red-800">
                  {returnResult?.failed} produits n'ont pas pu être importé.
                </li>}
              </ul>
            </CsvImporter>
        }
      </CardContent>
    </Card>
  )

}