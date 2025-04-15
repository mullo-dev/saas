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

export function TricksTable(props: { propsData: any }) {
  const [data, setData] = React.useState(props.propsData)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mt-10 mb-2">
        <h4>Produits</h4>
        <CsvImporter
          fields={[
            { label: "Référence", value: "ref", required: true },
            { label: "Name", value: "name", required: true },
            { label: "Description", value: "description" },
            { label: "Prix", value: "price", required: true }
          ]}
          onImport={(parsedData) => {
            const formattedData: any = parsedData.map(
              (item) => ({
                ref: String(item.ref ?? ""),
                name: String(item.name ?? ""),
                description: String(item.description ?? ""),
                price: Number.isNaN(Number(item.price))
                  ? 0
                  : Number(item.points)
              })
            )
            setData((prev:any) => [...prev, ...formattedData])
          }}
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
            {data.map((item:any) => (
              <TableRow key={item.id}>
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
                  <span className="line-clamp-1">{item.prix}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
