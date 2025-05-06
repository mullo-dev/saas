"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { ExpandPanel } from "./extandPanel"
import { Button } from "@/components/ui/button"
import { AddTableCell } from "./addTableCell"

interface DataTableProps<TData, TValue> {
  updateCustomerSubCatalogue: () => void
  onToggleProduct: (product: any) => void 
  setSelectProducts: (prev:any) => void,
  columns: ColumnDef<TData, TValue>[]
  newCustomer: boolean,
  data: TData[],
  selectProducts: any,
  selectCustomer: any
}

export function DataTableProducts<TData, TValue>({
  updateCustomerSubCatalogue,
  onToggleProduct,
  setSelectProducts,
  columns,
  newCustomer,
  selectCustomer,
  selectProducts,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = React.useState({})

  // Update column visibility when selectCustomer changes
  React.useEffect(() => {
    if (selectCustomer?.customerId) {
      setColumnVisibility({
        enabled: false,
        action: false
      })
    } else {
      setColumnVisibility({}) // Show all columns
    }
  }, [selectCustomer?.customerId])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => true,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: (updater) => {
      if (typeof updater === 'function') {
        const newExpanded = updater(expanded) as Record<string, boolean>
        // Get the ID of the row that was just toggled
        const toggledId = Object.keys(newExpanded).find(id => newExpanded[id] !== expanded[id])
        if (toggledId) {
          // If the row is being expanded, close all others
          if (newExpanded[toggledId]) {
            setExpanded({ [toggledId]: true })
          } 
        } else {
          // If the row is being collapsed, just close it
          setExpanded(newExpanded)
        }
      } else {
        setExpanded(updater as Record<string, boolean>)
      }
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      const selectRow = table.getRowModel().rows.filter((row) => newSelection[row.id])
      newCustomer && onToggleProduct(selectRow) 
      // TO DO : make checkbox usefull when update subCatalogue's customer
      // TO DO : add actions if newCustomer is false
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      expanded,
      columnVisibility
    },
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrer par nom..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {selectCustomer?.customerId && 
          <Button onClick={() => updateCustomerSubCatalogue()} disabled={selectProducts.length <= 0}>
            Mettre à jour le catalogue du client
          </Button>
        }
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={`${row.getIsExpanded() && "bg-secondary/20 hover:bg-secondary/20 border-b-0"} relative z-10`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    {(selectCustomer?.customerId || newCustomer) && 
                      <AddTableCell
                        item={row.original}
                        selectCustomer={selectCustomer}
                        selectProducts={selectProducts}
                        setSelectProducts={setSelectProducts}
                      />
                    }
                  </TableRow>
                  <TableRow className="border-b-0 bg-secondary/20 hover:bg-secondary/20 relative z-0">
                    <TableCell className="p-0"></TableCell>
                    <TableCell colSpan={row.getVisibleCells().length - 1} className="p-0">
                      <AnimatePresence initial={false}>
                        {row.getIsExpanded() && (
                          <motion.div
                            key="expanded"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <ExpandPanel row={row} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        {selectCustomer?.customerId && 
          <Button onClick={() => updateCustomerSubCatalogue()} disabled={selectProducts.length <= 0}>
            Mettre à jour le catalogue du client
          </Button>
        }
      </div>
    </>
  )
}