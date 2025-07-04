"use client"

import * as React from "react"
import { CsvImporter } from "./csv-importer"
import { useParams } from "next/navigation"
import { createProducts } from "@/actions/products/actions/create"
import { toast } from "sonner"
import { DataTableProducts } from "../global/tables/products/table"
import { columnsProducts } from "../global/tables/products/columns"
import ProductForm from "../global/forms/productForm"
import { DrawerDialog } from "../global/modal"


export function TricksTable(
  props: {
    updateCustomerSubCatalogue: () => void,
    setSelectProducts: (prev:any) => void,
    catalogue: any, 
    newCustomer: boolean,
    onToggleProduct: (products:any) => void 
    selectProducts: any,
    selectCustomer: any,
    reload: () => void,
  }) {
  const { catalogueId } = useParams()
  const [returnResult, setReturnResult] = React.useState<any>()

  const toUploadData = async (parsedData:any) => {
    try {
      const result = await createProducts({products: parsedData, catalogueId: catalogueId as string})
      if (result?.data?.success) {
        toast.success("Produits importés !")
        setReturnResult(result.data)
        return {success: true, error: {}}
      } else {
        toast.success("Une erreur est survenue...")
        return {success: false, error: result?.data?.error}
      }
    } catch (error) {
      toast.success("Une erreur est survenue...")
      return {success: false, error: error}
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-md">{props.newCustomer ? "Produits à inclure :" : "Produits"}</h4>
        <div className="flex gap-2">
          {!props.newCustomer && 
            <>
              <DrawerDialog 
                title="Nouveau produit" 
                buttonTitle="Nouveau produit"
                description="Ajouter un produit à votre catalogue"
              >
                {(p) => <ProductForm setOpen={p.setOpen} catalogueId={catalogueId as string} reload={props.reload} />}
              </DrawerDialog>
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
            </>
          }
        </div>
      </div>

      <DataTableProducts 
        data={props.catalogue.products}
        columns={columnsProducts}
        onToggleProduct={props.onToggleProduct}
        newCustomer={props.newCustomer}
        selectProducts={props.selectProducts}
        selectCustomer={props.selectCustomer}
        setSelectProducts={props.setSelectProducts}
        updateCustomerSubCatalogue={props.updateCustomerSubCatalogue}
      />
    </div>
  )
}