"use client"

import { Plus } from "lucide-react";
import { DrawerDialog } from ".";
import ProductForm from "../forms/productForm";
import { CsvImporter } from "@/components/csv-importer/csv-importer";

export function AddProductModal(props: {
  catalogueId: string,
  toUploadData: (parsedData:any) => Promise<{ success: boolean, error: any }>
  reload: () => void
  returnResult: any
}) {

  return (
    <DrawerDialog
      title="Nouveau produit" 
      buttonTitle={<Plus />}
      buttonSize={"icon"}
      description="Importer ou créer un produit"
    >
      {(p) => (
        <>
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
            onImport={(parsedData) => props.toUploadData(parsedData)}
            reload={props.reload}
            className="self-end"
          >
            <ul>
              <li className="text-sm font-bold">{props.returnResult?.updated} produits ont été mis à jour.</li>
              <li className="text-sm font-bold">{props.returnResult?.created} produits ont été créés.</li>
              {props.returnResult?.failed > 0 && <li className="text-sm font-bold text-red-800">
                {props.returnResult?.failed} produits n'ont pas pu être importé.
              </li>}
            </ul>
          </CsvImporter>
          <hr />
          <h3 className="font-bold text-sm">Ajouter un seul produit</h3>
          <ProductForm setOpen={p.setOpen} catalogueId={props.catalogueId} reload={props.reload} createByCustomer />
        </>
      )}
    </DrawerDialog>

  )
}