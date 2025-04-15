"use client"

import { DrawerDialog } from "@/components/global/modal";
import CatalogueForm from "@/components/global/forms/catalogueForm";
import CatalogueCard from "./catalogueCard";

type OrganizationWithCatalogues = {
  id: string,
  catalogues: { id: string }[]
}

export default function CatalogueSection(props: { organization?: OrganizationWithCatalogues }) {

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
          {(p) => <CatalogueForm organizationId={props.organization?.id} setOpen={p.setOpen}/>}
        </DrawerDialog>
      </div>
      <hr />

      {props.organization?.catalogues && props.organization.catalogues.map((cat, index) => (
        <CatalogueCard key={index} catalogueId={cat.id} />
      ))}
    </div>
  )
}