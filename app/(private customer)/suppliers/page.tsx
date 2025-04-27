"use client"

import SupplierCard from "./supplierCard"
import { useEffect, useState } from "react"
import { returnOnlySuppliers } from "@/actions/user/action"
import { ProductsTable } from "@/components/global/table/table"
import { getAllProducts } from "@/actions/products/actions"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function profilPage() {
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>()
  const [allProducts, setAllProducts] = useState<any>()
  const [selectSupplier, setSelectSupplier] = useState<string>()

  const selectSupplierId = (id:string) => {
    setSelectSupplier((prev) => prev === id ? "" : id)
  }

  const filtered = async () => {
    const result = await returnOnlySuppliers()
    if (result?.data?.success) {
      setFilteredOrganizations(result?.data?.filteredOrganizations)
    }
  }

  const getProducts = async () => {
    const result = await getAllProducts()
    setAllProducts(result?.data?.products)
  }

  useEffect(() => {
    filtered()
    getProducts()
  }, [])
  

  return (
    <div>
      <h2 className="font-bold text-xl">Vos fournisseurs</h2>
      <div className="flex gap-2 mt-5">
        {filteredOrganizations?.map((orga:any, index:number) => (
          <SupplierCard key={index} organization={orga} selectSupplierId={selectSupplierId} isSelected={selectSupplier === orga.id} />
        ))}
      </div>
      <div className="mt-10">
        <Link href="/suppliers/tunnel" className={buttonVariants()}>
          Passer commande
        </Link>
        <div className="mt-5">
          <ProductsTable supplierId={selectSupplier} propsData={allProducts} />
        </div>
      </div>
    </div>
  )

}