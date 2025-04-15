"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CsvImporter } from "./csv-importer"
import { useParams } from "next/navigation"
import { createProducts } from "@/actions/produits/actions"
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"


export function TricksTable(
  props: { 
    propsData: any, 
    formActive: boolean,
    onToggleProduct: (productId: string, price: number, checked: boolean) => void 
    selectProducts: any
  }) {
  const { catalogueId } = useParams()

  const toUploadData = async (parsedData:any) => {
    const formattedData = parsedData.map((item:any) => ({
        ref: String(item.chooseRef ?? ""),
        name: String(item.chooseName ?? ""),
        description: String(item.chooseDescription ?? ""),
        price: Number.isNaN(Number(item.choosePrice))
          ? 0
          : Number(item.choosePrice),
        catalogueId: String(catalogueId)
      })
    )

    const result = await createProducts(formattedData)

    if (result?.data?.success) {
      toast.success("Produits importés !")
      // we need to reload based composant to display products immediatly
      // Reput useState but with return products (not possible with create many ?)
    } else {
      toast.success("Une erreur est survenue...")
      console.log(result?.data)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mt-5 mb-2">
        <h4>{props.formActive ? "Produits à inclure :" : "Produits"}</h4>
        {!props.formActive && 
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {props.formActive && 
                <TableHead>Inc</TableHead>
              }
              <TableHead>Référence</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.propsData.map((item:any, index:number) => (
              <TableRow key={index}>
                {props.formActive && 
                  <TableCell className="font-medium w-15">
                    <Checkbox onCheckedChange={(checked) => props.onToggleProduct(item.id, item.price, checked === true )} />
                  </TableCell>
                }
                <TableCell className="font-medium w-40">
                  <span className="line-clamp-1">{item.ref}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-1">{item.name}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  <span className="line-clamp-3">{item.description}</span>
                </TableCell>
                <TableCell className="max-w-[100px]">
                  {props.formActive && props.selectProducts.find((select:any) => select.productId === item.id) ?
                    <Input 
                      type="number" 
                      defaultValue={item.price}
                      onBlur={(e) => props.onToggleProduct(item.id, Number(e.target.value), true )}
                    />
                  : 
                    <span className="line-clamp-1">{item.price}</span>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
