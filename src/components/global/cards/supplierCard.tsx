"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvitation } from "@/actions/invitations/actions/accept"
import { toast } from "sonner"
import { ConversationDrawer } from "@app/(private)/(private supplier)/dashboard/customers/conversationDrawer"
import { Button } from "@/components/ui/button"
import { CsvImporter } from "@/components/csv-importer/csv-importer"
import { createProducts } from "@/actions/products/actions/create"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit } from "lucide-react"
import { useState } from "react"
import { createCatalogue } from "@/actions/catalogue/actions/create"

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
    if (!props.organization) throw new Error("Organization not found")
    let theCatalogue

    if (props.organization.catalogues[0]) {
      theCatalogue = props.organization.catalogues[0].id
      console.log("déjà la")
    } else {
      const result = await createCatalogue({
        name: "Catalogue",
        organizationId: props.organization.id
      })
      console.log("coucou")
      if (result?.data?.catalogue) {
        theCatalogue = result?.data?.catalogue.id
      } else {
        throw new Error("Catalogue not found")
      }
    }

    console.log(theCatalogue)

    const result = await createProducts({products: parsedData, createByCustomer: true, catalogueId: theCatalogue})
    if (result?.data?.success) {
      toast.success("Produits importés !")
      setReturnResult(result.data)
      return { success: true, error: null }
    } else {
      toast.success("Une erreur est survenue...")
      console.log(result?.validationErrors)
      return { success: false, error: result?.data?.error }
    }
  }

  if (!props.organization) {
    return <p>Chargement...</p>
  }

  return ( 
    <Card 
      className={`
        flex h-full bg-primary-800
        ${props.organization.invit && "opacity-50 hover:opacity-80 transition-all"} 
        ${props.isSelected && "bg-primary"}
      `}
    >
      <CardHeader>
        <CardTitle className="flex justify-between font-bold text-white">
          {props.organization.name}
          <Checkbox className="cursor-pointer" onCheckedChange={e => props.selectSupplierId(props.organization.id, e as boolean)} />
        </CardTitle>
        <CardDescription className="text-white">
          {props.organization.slug}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-1 items-end">
        {props.organization.invit ? // if the invitation isn't accepted yet
          <p>En attente : 
            <Button 
              onClick={() => props.organization.invit && invitationValidation()} 
              className="font-italic text-orange-400"
            >
              Accepter l'invitation
            </Button>
          </p>
        : 
          // the supplier is real
          props.organization.members[0] ? 
            <ConversationDrawer receipt={props.organization.members[0].user} />

          // the supplier was created by the customer...
          : props.organization.catalogues[0]?.subCatalogues.reduce((acc:any, subCat:any) => acc + subCat._count.products,0) > 0 ? // ...and have a catalogue
            <Button size="icon" variant="outline">
              <Edit />
            </Button>
          : // ...don't have catagloue yet
            <CsvImporter
              fields={[
                { label: "Référence", value: "chooseRef", required: true },
                { label: "Name", value: "chooseName", required: true },
                { label: "Description", value: "chooseDescription" },
                { label: "Prix", value: "choosePrice", required: true },
                { label: "Unité de vente", value: "chooseUnit", required: true },
                { label: "Quantité par colis", value: "chooseSellQuantity", required: true },
                { label: "Taux de TVA", value: "chooseTvaValue" },
                { label: "Catégories", value: "chooseCategories" }
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
      </CardFooter>
    </Card>
  )

}