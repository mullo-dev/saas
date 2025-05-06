"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSubCatalogue } from "@/actions/catalogue/actions/create";
import { useParams } from "next/navigation";
import { TricksTable } from "@/components/csv-importer/tricks-table";
import { Shell } from "@/components/csv-importer/shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { selectProductModel } from "@/actions/products/model"
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import CustomerCard from "./customerCard";
import { getCatalogueById } from "@/actions/catalogue/actions/get";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { addProductsInSubCatalogue } from "@/actions/catalogue/actions/update";

type SelectProduct = z.infer<typeof selectProductModel>;

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<any>(null);
  const [selectProducts, setSelectProducts] = useState<SelectProduct[]>([]);
  const [newCustomer, setNewCustomer] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")
  const [customer, setCustomer] = useState<any>({})
  const { catalogueId } = useParams()
  const { data: organizations } = authClient.useListOrganizations()

  const fetchCatalogue = async () => {
    if (catalogueId) {
      const cat = await getCatalogueById({catalogueId: catalogueId as string})
      setCatalogue(cat?.data?.catalogue);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, [catalogueId, toast]);


  const addProductInSubCatalogue = (products:any) => {
    // Filter to delete products
    const productsIds = products.map((r: any) => r.original.id);
    const newArray = selectProducts.filter((p) => productsIds.includes(p.productId))
    // Add new products
    products.map((prod:any) => {
      if (!newArray.find((p) => p.productId === prod.original.id)) {
        newArray.push({
          price: prod.original.price,
          productId: prod.original.id,
        })
      }
    })
    setSelectProducts(newArray)
  };

  const addSubCatalogue = async () => {
    if (organizations && selectProducts.length > 0) {
      const result = await createSubCatalogue({
        subCatalogue: {
          customerEmail: customerEmail,
          catalogueId: catalogueId as string
        }, 
        selectProducts: selectProducts,
        organization: organizations[0]
      })
      if (result?.data?.success) {
        toast.success("Validé !")
        setNewCustomer(false)
        fetchCatalogue();
      } else {
        toast.error("Une erreur est survenue")
        console.log(result?.data?.error)
      }
    } else {
      toast.error("Vous n'avez pas ajouté de produits")
    }
  }


  const updateCustomerSubCatalogue = async () => {
    const result = await addProductsInSubCatalogue({
      subCatalogueId: customer.subCatId,
      selectProducts: selectProducts
    })
    if (result?.data?.success) {
      toast.success("Produits importés !")
      setSelectProducts([])
      setCustomer({})
      fetchCatalogue()
    } else {
      toast.success("Une erreur est survenue...")
    }
  }


  // const updateSubCatalogue
  if (!catalogue) {
    return <p>Loading...</p>
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">
          {newCustomer ?
            "Nouveau client"
          : "Catalogue : " + catalogue.name}
        </h1>
        
      </div>

      {/* CARD ADD CUSTOMER */}
      {newCustomer ?
        <Card className="mt-5 px-4">
          <Label>Email du client</Label>
          <Input onChange={(e) => setCustomerEmail(e.target.value)} />
          <div className="flex justify-between items-center">
            <p>{selectProducts.length} produits inclus</p>
            <div className="flex gap-2">
              <Button onClick={addSubCatalogue}>Valider</Button>
              <Button onClick={() => setNewCustomer(false)} variant="destructive">Annuler</Button>
            </div>
          </div>
        </Card>
      : 
      <>
        {/* CARDS CUSTOMERS */}
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CustomersCarousel 
            setCustomer={setCustomer}
            customer={customer}
            setSelectProducts={setSelectProducts}
            setNewCustomer={setNewCustomer}
            catalogue={catalogue}
          />
        </Carousel>

        <hr className="mt-4"/>
      </>
      }

      {/* PRODUCTS TABLE */}
      <Shell>
        <TricksTable 
          catalogue={catalogue} 
          newCustomer={newCustomer} 
          onToggleProduct={addProductInSubCatalogue}
          selectProducts={selectProducts}
          setSelectProducts={setSelectProducts}
          selectCustomer={customer}
          reload={fetchCatalogue}
          updateCustomerSubCatalogue={updateCustomerSubCatalogue}
        />
      </Shell>
    </div>
  )
}


// Carousel for customers cards
function CustomersCarousel(props: {
  setNewCustomer: (value:boolean) => void,
  setSelectProducts: (value:any) => void,
  setCustomer: (value:any) => void
  customer: any,
  catalogue: any,
}) {
  const context = useCarousel()

  return (
    <>  
      <div className="md:flex justify-between items-center mb-1 mt-2">
        <h2 className="font-bold md:mb-0 text-md">Clients</h2>
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
          <Button 
            variant="secondary" 
            onClick={() => {
              props.setNewCustomer(true) 
              props.setSelectProducts([])}
            }
          >
            Nouveau client
          </Button>
        </div>
      </div>
      <CarouselContent>
        {props.catalogue.subCatalogues.length > 0 && props.catalogue.subCatalogues.map((subCat:any, index:number) => (
          <CarouselItem key={index}  className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
            <CustomerCard 
              customer={props.customer}
              subCat={subCat}
              setCustomer={props.setCustomer}
              setSelectProducts={props.setSelectProducts}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </>
  )
}