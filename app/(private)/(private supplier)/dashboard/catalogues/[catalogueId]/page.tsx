"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSubCatalogue } from "@/actions/catalogue/actions/create";
import { useParams, useRouter } from "next/navigation";
import { TricksTable } from "@/components/csv-importer/tricks-table";
import { Shell } from "@/components/csv-importer/shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { selectProductModel } from "@/actions/products/model"
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getCatalogueById } from "@/actions/catalogue/actions/get";
import { addProductsInSubCatalogue } from "@/actions/catalogue/actions/update";
import { usePageTitle } from "@/lib/context/pageTitle";
import CustomersCarousel from "@/components/global/carousels/customersCarousel";
import { Trash2 } from "lucide-react";
import { deleteCatalogue } from "@/actions/catalogue/actions/delete";

type SelectProduct = z.infer<typeof selectProductModel>;

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<any>(null);
  const [selectProducts, setSelectProducts] = useState<SelectProduct[]>([]);
  const [newCustomer, setNewCustomer] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")
  const [customer, setCustomer] = useState<any>({})
  const { catalogueId } = useParams()
  const { data: organizations } = authClient.useListOrganizations()
  const { setTitle } = usePageTitle();
  const route = useRouter()

  const deleteCatalogueAction = async () => {
    const result = await deleteCatalogue({
      catalogueId: catalogue.id,
      organizationId: catalogue.organizationId
    })
    console.log(result)
    if (result?.data?.success) {
      toast.info("Catalogue supprimé")
      route.push("/dashboard")
    } else {
      toast.error("Une erreur est survenue")
    }
  }
  
  const fetchCatalogue = async () => {
    if (catalogueId) {
      const cat = await getCatalogueById({catalogueId: catalogueId as string})
      setCatalogue(cat?.data?.catalogue);
    }
  };
  
  useEffect(() => {
    fetchCatalogue();
  }, [catalogueId, toast]);
  
  useEffect(() => {
    setTitle({
      title: catalogue ? "Catalogue : " + catalogue?.name : "Catalogue",
      menuContent: 
        <Button 
          variant="outline" 
          className='hover:bg-destructive' 
          size="icon" 
          onClick={() => deleteCatalogueAction()}
        >
          <Trash2 />
        </Button>
    });
  }, [catalogue]);

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
      {/* CARD ADD CUSTOMER */}
      {newCustomer ?
        <Card>
          <CardHeader>
            <CardTitle>Nouveau client</CardTitle>
            <CardDescription>
              Vous pouvez assigner, à votre nouveau client, tout ou une partie des produits contenus dans ce catalogue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="mb-2">Email du client</Label>
            <Input onChange={(e) => setCustomerEmail(e.target.value)} />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p>{selectProducts.length} produits inclus</p>
            <div className="flex gap-2">
              <Button disabled={selectProducts.length <= 0} onClick={addSubCatalogue}>Valider</Button>
              <Button onClick={() => setNewCustomer(false)} variant="destructive">Annuler</Button>
            </div>
          </CardFooter>
        </Card>
      : 
      <>
        {/* CARDS CUSTOMERS */}
        <CustomersCarousel
          setCustomer={setCustomer}
          customer={customer}
          setSelectProducts={setSelectProducts}
          setNewCustomer={setNewCustomer}
          customers={catalogue.subCatalogues}
        />
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