"use client"

import * as React from "react"
import { CsvImporter } from "./csv-importer"
import { useParams } from "next/navigation"
import { createProducts } from "@/actions/products/actions/create"
import { toast } from "sonner"
import { DataTableProducts } from "../global/tables/products/table"
import { columnsProducts } from "../global/tables/products/columns"
import { addProductsInSubCatalogue } from "@/actions/catalogue/actions/update"


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
    const formattedData = parsedData.map((item:any) => ({
        ref: String(item.chooseRef),
        name: String(item.chooseName),
        description: String(item.chooseDescription),
        price: typeof item.choosePrice === "number" ? item.choosePrice 
        : Number.isNaN(Number(item.choosePrice.replace(',', '.'))) ? 
          0
        : Number(item.choosePrice.replace(',', '.')),
        catalogueId: String(catalogueId),
        unit: String(item.chooseUnit),
        tvaValue: typeof item.chooseTvaValue === "number" ? item.chooseTvaValue 
          : Number.isNaN(Number(item.chooseTvaValue.replace(',', '.'))) ? 
            0
          : Number(item.chooseTvaValue.replace(',', '.')),
        categories: [String(item.chooseCategories)],
        enabled: true
      })
    )

    const result = await createProducts({products: formattedData, catalogueId: catalogueId as string})
    if (result?.data?.success) {
      toast.success("Produits importés !")
      setReturnResult(result.data)
    } else {
      console.log(result)
      toast.success("Une erreur est survenue...")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-md">{props.newCustomer ? "Produits à inclure :" : "Produits"}</h4>
        {!props.newCustomer && 
          <CsvImporter
            fields={[
              { label: "Référence", value: "chooseRef", required: true },
              { label: "Name", value: "chooseName", required: true },
              { label: "Description", value: "chooseDescription" },
              { label: "Prix", value: "choosePrice", required: true },
              { label: "Unité de vente", value: "chooseUnit", required: true },
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