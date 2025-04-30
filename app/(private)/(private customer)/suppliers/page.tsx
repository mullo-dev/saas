"use client"

import SupplierCard from "./supplierCard"
import { Suspense, useEffect, useState } from "react"
import { returnOnlySuppliers } from "@/actions/user/actions/get"
import { ProductsTable } from "@/components/global/table/productsTable"
import { getAllProducts } from "@/actions/products/actions/get"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { DrawerDialog } from "@/components/global/modal"
import SupplierForm from "@/components/global/forms/supplierForm"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

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
        <Suspense fallback={<Skeleton className="w-full h-[100px] rounded-xl" />}>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {filteredOrganizations?.map((orga:any, index:number) => (
                <CarouselItem className="basis-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <SupplierCard 
                    key={index} 
                    organization={orga} 
                    selectSupplierId={selectSupplierId} 
                    isSelected={selectSupplier.includes(orga.id)} 
                    reload={getProducts}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          </Suspense>
      </div>
      <hr className="my-4"/>
      <h2 className="font-bold text-xl mb-4">Produits</h2>
      <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-xl" />}>
        <ProductsTable supplierId={selectSupplier} propsData={allProducts} />
      </Suspense>
    </div>
  )

}