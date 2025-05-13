"use client"

import { getOrganizationCatalogues } from "@/actions/catalogue/actions/get";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CatalogueForm } from "../forms/catalogueForm";
import { DrawerDialog } from "../modal";
import { Skeleton } from "@/components/ui/skeleton";
import CatalogueCard from "../cards/catalogueCard";

export default function CataloguesCarousel(props:{
  organizationId: string
}) {
  const [catalogues, setCatalogues] = useState<any>([])
  const [isPending, setIsPending] = useState(true)

  const fetchCatalogues = async () => {
    const result = await getOrganizationCatalogues({ organizationId: props.organizationId })
    if (result?.data?.success) {
      setCatalogues(result.data.catalogues)
      setIsPending(false) 
    } else {
      toast.error("Erreur lors du chargement des catalogues");
    }
  }

  useEffect(() => {
    fetchCatalogues()
  }, [])


  if (isPending) {
    return <Skeleton className="w-full h-[200px] rounded-xl"/>
  }

  return (
    catalogues.length > 0 ?
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CataloguesCarouselContent 
          catalogues={catalogues}
        />
      </Carousel>
    :
      <Card>
        <CardHeader>
          <CardTitle>Vous n'avez pas encore de catalogue.</CardTitle>
          <CardDescription>Les catalogues vous permettent de trier vos produits ainsi que vos clients.</CardDescription>
        </CardHeader>
        <CardFooter>
          <DrawerDialog 
            title="Nouveau catalogue" 
            buttonTitle="Ajouter votre premier catalogue"
            buttonSize="sm"
            description="Ajoutez un catalogue"
          >
            {(p) => <CatalogueForm organizationId={props.organizationId} setOpen={p.setOpen}/>}
          </DrawerDialog>
        </CardFooter>
      </Card>
  )
}


// Carousel for customers cards
function CataloguesCarouselContent(props: {
  catalogues: any
}) {
  const context = useCarousel()

  return (
    <> 
      <div className="md:flex justify-between items-center mb-1">
        <h2 className="font-bold md:mb-0 text-md">Catalogues</h2>
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
            <Button
              size="sm"
            >
              Nouveau Catalogue
            </Button>
          </div>
        </div>
      </div>
      <CarouselContent>
        {props.catalogues.map((cat:any, index:number) => (
          <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
            <CatalogueCard catalogue={cat} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </>
  )
}