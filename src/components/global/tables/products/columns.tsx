"use client"

import { updateProduct } from "@/actions/products/actions/update"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronDown, ChevronUp, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "sonner"
import { productType } from "@/actions/products/model"

export const columnsProducts: ColumnDef<productType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ref",
    header: ({ column }) => {
      return (
        <div className="max-w-3">
          <Button
            variant="ghostMuted"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Référence
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (<div className="max-w-20 overflow-hidden truncate">{row.original.ref}</div>)
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghostMuted"
          size="xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const [update, setUpdate] = useState(false)
      const [newValue, setNewValue] = useState<string>(row.getValue("name"))
      const [display, setDisplay] = useState<string>(row.getValue("name"))

      const onUpdateProduct = async () => {
        if (!newValue || newValue.length < 3) return toast.error("Le nom doit contenir au moins 3 caractères")
        if (row.original.id) {
          const result = await updateProduct({
            name: newValue,
            productId: row.original.id
          })
          if (result?.data?.success) {
            toast.success("Nom mis à jour")
            setDisplay(newValue)
            setUpdate(false)
          } else {
            toast.error('Une erreur est survenue')
          }
        }
      }

      return (
        <>
          {update ?
            <div className="flex gap-2">
              <Input defaultValue={row.getValue("name")} onChange={(e) => setNewValue(e.target.value)} />
              <Button size="icon" onClick={() => onUpdateProduct()}>
                <Check />
              </Button>
              <Button 
                size="icon" 
                variant="destructive" 
                onClick={() => { 
                  console.log('coucou')
                  setUpdate(false) 
                  setNewValue('')
                }}
              >
                <X />
              </Button>
            </div>
          : 
            <div onClick={() => setUpdate(true)}>{display}</div> }
        </>
      )
    }
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Prix</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "unit",
    header: () => <div className="max-w-10">Unité</div>,
    cell: ({ row }) => (<div className="max-w-10">{row.original.unit}</div>)
  },
  {
    accessorKey: "sellQuantity",
    header: () => <div className="max-w-10">Par colis</div>,
    cell: ({ row }) => (<div className="max-w-10">{row.original.sellQuantity}</div>)
  },
  {
    accessorKey: "enabled",
    header: () => <div className="max-w-10">Disponibilité</div>,
    cell: ({ row }) => {
      const [isChecked, setIsChecked] = useState<boolean>(row.original.enabled)

      const change = async () => {
        if (row.original.id) {
          const result = await updateProduct({
            enabled: !row.original.enabled,
            productId: row.original.id
          })
          if (result?.data?.success) {
            toast.success(`Produit rendu ${!row.original.enabled === true ? "disponible" : "indisponible"}`)
            setIsChecked(!isChecked)
          } else {
            toast.error('Une erreur est survenue')
          }
        }
      }

      return (
        <Switch checked={isChecked} onCheckedChange={change} />
      )
    }
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      return <div className="text-right font-medium">
        <Button size="icon" variant="ghost" onClick={() => row.toggleExpanded()}>
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
    },
  },
]
