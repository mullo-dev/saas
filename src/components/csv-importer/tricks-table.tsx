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

export function TricksTable(props: { propsData: any }) {
  const [data, setData] = React.useState(props.propsData)
  const { catalogueId } = useParams()

  console.log(props.propsData)

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
    console.log(formattedData)
    const result = await createProducts(formattedData)

    if (result?.data?.success) {
      toast.success("Produits importés !")
      setData((prev:any) => [...prev, ...formattedData])
    } else {
      toast.success("Une erreur est survenue...")
      console.log(result?.data)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mt-10 mb-2">
        <h4>Produits</h4>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Référence</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item:any, index:number) => (
              <TableRow key={index}>
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
                  <span className="line-clamp-1">{item.price}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
