"use client"

import { DrawerDialog } from "@/components/global/modal";
import CatalogueForm from "@/components/global/forms/catalogueForm";
import CatalogueCard from "./catalogueCard";
import { useEffect, useState } from "react";
import { Catalogue } from "@prisma/client"
import { getOrganizationCatalogue } from "@/actions/catalogue/actions";

export default function CatalogueSection(props: { organizations: any }) {
  const [catalogues, setCatalogues] = useState<Catalogue[]>()

  useEffect(() => {
    const getCatalogues = async () => {
      const response = await getOrganizationCatalogue({organizationId: props.organizations[0].id})
      if (response?.data?.success) {
        setCatalogues(response.data.catalogues)
      }
    }
    getCatalogues()
  }, [props.organizations])
  

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-md">Vos catalogues</h4>
        <DrawerDialog 
          title="Nouveau catalogue" 
          buttonTitle="ajouter"
          buttonSize="sm"
          description="Ajoutez un catalogue"
        >
          {(p) => <CatalogueForm organizationId={props.organizations[0]?.id} setOpen={p.setOpen}/>}
        </DrawerDialog>
      </div>
      <hr />

      {catalogues && catalogues.map((cat, index) => (
        <CatalogueCard key={index} catalogueId={cat.id} />
      ))}
    </div>
  )
}