"use client"

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CustomerCard from "../cards/customerCard";

export default function CustomersCarousel(props:{
  setNewCustomer?: (value:boolean) => void,
  setSelectProducts?: (value:any) => void,
  setCustomer?: (value:any) => void
  customer?: any,
  customers: any,
  withoutTools?: boolean
}) {

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CustomersCarouselContent 
        setCustomer={props.setCustomer}
        customer={props.customer}
        setSelectProducts={props.setSelectProducts}
        setNewCustomer={props.setNewCustomer}
        customers={props.customers}
        withoutTools={props.withoutTools}
      />
    </Carousel>
  )
}


// Carousel for customers cards
function CustomersCarouselContent(props: {
  setNewCustomer?: (value:boolean) => void,
  setSelectProducts?: (value:any) => void,
  setCustomer?: (value:any) => void
  customer?: any,
  customers: any,
  withoutTools?: boolean
}) {
  const context = useCarousel()

  return (
    <>  
      {props.withoutTools || props.customers.length > 0 ?
      <>
        <div className="md:flex justify-between items-center mb-1">
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
            {!props.withoutTools && <Button
              onClick={() => {
                props.setNewCustomer?.(true) 
                props.setSelectProducts?.([])}
              }
            >
              Nouveau client
            </Button>}
          </div>
        </div>
        <CarouselContent>
          {props.customers.map((subCat:any, index:number) => (
            <CarouselItem key={index}  className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <CustomerCard
                customer={props.customer}
                subCat={subCat}
                setCustomer={props.setCustomer}
                setSelectProducts={props.setSelectProducts}
                withoutTools={props.withoutTools}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
      :
      <Card className="mt-2">
        <CardHeader className="text-center">
          <CardTitle>Pas encore de client associé à ce catalogue</CardTitle>
          <CardDescription className="text-center">Ajouter un client et assigné lui des produits et leur prix associé.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => {
              props.setNewCustomer?.(true) 
              props.setSelectProducts?.([])}
            }
          >
            Ajouter le premier client
          </Button>
        </CardFooter>
      </Card>
      }
    </>
  )
}