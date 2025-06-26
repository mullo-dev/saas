"use client"

import SupplierCard from "../../../../src/components/global/cards/supplierCard"
import { Suspense, useEffect, useState, useTransition } from "react"
import { returnOnlySuppliers } from "@/actions/user/actions/get"
import { ProductsTable } from "@/components/global/tables/productsTable"
import { getAllProducts } from "@/actions/products/actions/get"
import { DrawerDialog } from "@/components/global/modal"
import SupplierForm from "@/components/global/forms/supplierForm"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useCarousel } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useSearchParams } from "next/navigation"

export default function suppliersPage() {
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>([])
  const [allProducts, setAllProducts] = useState<any>()
  const [selectSupplier, setSelectSupplier] = useState<string[]>([])
  const [isPending, startTransition] = useTransition();
  
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
      setFilteredOrganizations(result.data.filteredOrganizations)
    }
  }

  const getProducts = async () => {
    const result = await getAllProducts()
    if (result?.data?.success) {
      setAllProducts(result.data.products)
    }
  }

  useEffect(() => {
    startTransition(() => {
      filtered()
      getProducts()
    })
  }, [])

  if (isPending) {
    return <Skeleton className="w-full h-80" />
  }
  
  return (
    <div>
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-xl" />}>
        {!isPending && <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <SupplierCarousel 
            selectSupplier={selectSupplier}
            selectSupplierId={selectSupplierId}
            getProducts={getProducts}
            filteredOrganizations={filteredOrganizations}
            reload={filtered}
          />
        </Carousel>}
      </Suspense>
      <hr className="my-4"/>
      <h2 className="font-bold text-xl mb-4">Produits</h2>
      <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-xl" />}>
        <ProductsTable supplierId={selectSupplier} propsData={allProducts} />
      </Suspense>
    </div>
  )

}



function SupplierCarousel(props: {
  selectSupplierId: (id:string, status:boolean) => void,
  getProducts: () => void,
  filteredOrganizations: any,
  selectSupplier: any,
  reload: () => void
}) {
  const context = useCarousel()
  const searchParams = useSearchParams()
  const messageId = searchParams.get("messageId")

  return (
    props.filteredOrganizations.length > 0 ?  
      <>
        <div className="md:flex justify-between items-center mb-3">
          <h2 className="font-bold mb-2 md:mb-0 text-xl">Fournisseurs</h2>
          <div className="flex justify-between gap-2 items-center">
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="outline"
                className="rounded-full" 
                onClick={() => context.scrollPrev()}
                disabled={!context.canScrollPrev}
              >
                <ArrowLeft />
              </Button>
              <Button 
                size="icon" 
                variant="outline"
                className="rounded-full" 
                onClick={() => context.scrollNext()}
                disabled={!context.canScrollNext}
              >
                <ArrowRight />
              </Button>
            </div>
            <DrawerDialog
              title="Ajouter un nouveau fournisseur" 
              buttonTitle={"Ajouter un fournisseur"}
              description="Sélectionnez ou créez un fournisseur"
            >
              {(p) => <SupplierForm reload={props.reload} setOpen={p.setOpen} />}
            </DrawerDialog>
          </div>
        </div>
        <CarouselContent>
          {props.filteredOrganizations?.map((orga:any, index:number) => {
            return (
            <CarouselItem key={index}  className="basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SupplierCard
                organization={orga} 
                selectSupplierId={props.selectSupplierId} 
                isSelected={props.selectSupplier.includes(orga.id)} 
                reload={() => {
                  props.reload()
                  props.getProducts()
                }}
                openDialog={messageId === orga.id}
              />
            </CarouselItem>
          )})}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    :
      <Card className="mt-2">
        <CardHeader className="text-center">
          <CardTitle>Pas encore de fournisseur</CardTitle>
          <CardDescription className="text-center">Ajoutez un fournisseur existant ou configurez le vous même.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <DrawerDialog
            title="Ajouter un nouveau fournisseur" 
            buttonTitle={"Ajouter votre premier fournisseur"}
            description="Sélectionnez ou créez un fournisseur"
          >
            {(p) => <SupplierForm reload={props.reload} setOpen={p.setOpen} />}
          </DrawerDialog>
        </CardFooter>
      </Card>
  )
}