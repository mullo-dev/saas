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
import { createProducts } from "@/actions/products/actions"
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"


export function TricksTable(
  props: { 
    propsData: any, 
    formActive: boolean,
    onToggleProduct: (productId: string, price: number, checked: boolean) => void 
    selectProducts: any,
    selectCustomer: any,
    reload: () => void
  }) {
  const { catalogueId } = useParams()
  const [returnResult, setReturnResult] = React.useState<any>()

  const toUploadData = async (parsedData:any) => {
    const formattedData = parsedData.map((item:any) => ({
        ref: String(item.chooseRef),
        name: String(item.chooseName),
        description: String(item.chooseDescription),
        price: Number.isNaN(Number(item.choosePrice.replace(',', '.')))
          ? 0
          : Number(item.choosePrice.replace(',', '.')),
        catalogueId: String(catalogueId)
      })
    )

    const result = await createProducts({products: formattedData, catalogueId: catalogueId as string})
    if (result?.data?.success) {
      toast.success("Produits importés !")
      setReturnResult(result.data)
    } else {
      toast.success("Une erreur est survenue...")
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
            {props.propsData.map((item:any, index:number) => {
              const isInSubCatalogue = props.selectCustomer?.products?.find((id:any) => id.productId === item.id)
              return (
                <TableRow key={index} className={isInSubCatalogue && "bg-green-50"}>
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
                    : isInSubCatalogue ?
                      <div className="flex gap-2">
                        <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring px-2">        
                          <Input 
                            type="number"
                            className="border-0 focus-visible:ring-0 shadow-none" 
                            defaultValue={isInSubCatalogue.price}
                            onBlur={(e) => props.onToggleProduct(item.id, Number(e.target.value), true )}
                          />        
                          <span className="text-gray-500 font-bold text-xs">  
                            Prix public : {item.price}        
                          </span>      
                        </div>
                        <Button
                          variant="destructive"
                        >
                          <Trash />
                        </Button>
                      </div>
                    : props.selectCustomer?.products?.length > 0 ?
                      <div className="flex justify-between">
                        <span className="line-clamp-1">
                          {item.price}
                        </span>
                        <Button 
                          size="sm"
                          variant="secondary"
                        >
                          ajouter
                        </Button>
                      </div>
                    :
                      <span className="line-clamp-1">
                        {item.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + '€'}
                      </span>
                    }
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
