"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSubCatalogue, getCatalogueById } from "@/actions/catalogue/actions";
import { useParams } from "next/navigation";
import { TricksTable } from "@/components/csv-importer/tricks-table";
import { Shell } from "@/components/csv-importer/shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { selectProductModel } from "@/actions/products/model"
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import CustomerCard from "./customerCard";

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


  const addProductInSubCatalogue = (productId: string, price: number, checked: boolean) => {
    setSelectProducts((prev) => {
      const exists = prev.find((p) => p.productId === productId);
  
      if (checked) {
        if (exists) {
          // Mise à jour du prix si déjà sélectionné
          return prev.map((p) =>
            p.productId === productId ? { ...p, price } : p
          );
        } else {
          // Ajout si pas encore sélectionné
          return [...prev, { productId, price }];
        }
      } else {
        // Suppression si désélectionné
        return prev.filter((p) => p.productId !== productId);
      }
    });
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


  // const updateSubCatalogue

  if (!catalogue) {
    return <p>Loading...</p>
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">
          {newCustomer ?
            "Nouveau client"
          : "Catalogue : " + catalogue.name}
        </h1>
        <Button 
          variant="secondary" 
          onClick={() => {
            setNewCustomer(prev => !prev) 
            setSelectProducts([])
          }}
        >
          {newCustomer ? "Annuler" : "Nouveau client"}
        </Button>
      </div>
      
      {/* CARDS CUSTOMERS */}
      {catalogue.subCatalogues.length > 0 && catalogue.subCatalogues.map((subCat:any, index:number) => (
        <div className="flex gap-2" key={index}>
          <CustomerCard 
            customer={customer}
            subCat={subCat}
            setCustomer={setCustomer}
          />
        </div>
      ))}

      {/* CARD ADD CUSTOMER */}
      {newCustomer &&
        <Card className="mt-5 px-4">
          <Label>Email du client</Label>
          <Input onChange={(e) => setCustomerEmail(e.target.value)} />
          <div className="flex justify-between items-center">
            <p>{selectProducts.length} produits inclus</p>
            <Button onClick={addSubCatalogue}>Valider</Button>
          </div>
        </Card>
      }

      {/* PRODUCTS TABLE */}
      <Shell>
        <TricksTable 
          propsData={catalogue.products} 
          formActive={newCustomer} 
          onToggleProduct={addProductInSubCatalogue}
          selectProducts={selectProducts}
          selectCustomer={customer}
          reload={fetchCatalogue}
        />
      </Shell>
    </div>
  )
}