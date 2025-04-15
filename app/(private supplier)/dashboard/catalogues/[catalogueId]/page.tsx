"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCatalogueById } from "@/actions/catalogue/actions";
import { useParams } from "next/navigation";
import { TricksTable } from "@/components/csv-importer/tricks-table";
import { Shell } from "@/components/csv-importer/shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { selectProductModel } from "@/actions/produits/model"
import { z } from "zod";
import { Label } from "@/components/ui/label";

type SelectProduct = z.infer<typeof selectProductModel>;

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<any>(null);
  const [selectProducts, setSelectProducts] = useState<SelectProduct[]>([]);
  const [newCustomer, setNewCustomer] = useState(false)
  const { catalogueId } = useParams()

  useEffect(() => {
    const fetchCatalogue = async () => {
      if (catalogueId) {
        const cat = await getCatalogueById({catalogueId: catalogueId as string})
        setCatalogue(cat?.data?.catalogue);
      }
    };
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
  
  

  if (!catalogue) {
    return <p>Loading...</p>
  }

  return (
    <div>
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

      {newCustomer &&
        <Card className="mt-5 px-4">
          <Label>Client</Label>
          <Input />
          <p>{selectProducts.length} produits inclus</p>
        </Card>
      }
      <Shell>
        <TricksTable 
          propsData={catalogue.products} 
          formActive={newCustomer} 
          onToggleProduct={addProductInSubCatalogue}
          selectProducts={selectProducts}
        />
      </Shell>
    </div>
  )
}