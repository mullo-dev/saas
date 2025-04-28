"use client"

import SupplierCard from "./supplierCard"
import { useEffect, useState } from "react"
import { returnOnlySuppliers } from "@/actions/user/action"
import { ProductsTable } from "@/components/global/table/table"
import { getAllProducts } from "@/actions/products/actions"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { DrawerDialog } from "@/components/global/modal"
import SupplierForm from "@/components/global/forms/supplierForm"

export default function profilPage() {
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>()
  const [allProducts, setAllProducts] = useState<any>()
  const [selectSupplier, setSelectSupplier] = useState<string[]>([])

  const selectSupplierId = (id:string, status:boolean) => {
    if (status) {
      setSelectSupplier((prev) => [...prev, id])
    } else {
      setSelectSupplier((prev) => prev.filter((p) => p !== id))
    }
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
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Vos fournisseurs</h2>
        <DrawerDialog
          title="Ajouter un nouveau fournisseur" 
          buttonTitle={"Ajouter un fournisseur"}
          description="Sélectionnez ou créez un fournisseur"
        >
          {(props) => <SupplierForm setOpen={props.setOpen} />}
        </DrawerDialog>
      </div>
      <div className="flex gap-2 mt-5">
        {filteredOrganizations?.map((orga:any, index:number) => (
          <SupplierCard key={index} organization={orga} selectSupplierId={selectSupplierId} isSelected={selectSupplier.includes(orga.id)} />
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