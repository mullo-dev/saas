"use client"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCatalogueById } from "@/actions/catalogue/actions";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { productType } from "@/actions/produits/model";
import { useParams } from "next/navigation";
import UploadButton from "@/components/global/buttons/uploadButton";
import UseCsvButton from "@usecsv/react";

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<any>(null);
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

  if (!catalogue) {
    return <p>Loading...</p>
  }


  return (
    <div>
      <h1 className="font-bold text-2xl">Catalogue : {catalogue.name}</h1>

      <div className="flex justify-between items-center mt-10 mb-2">
        <h4>Produits</h4>
        <UploadButton />
      </div>
      <Table>
        <TableCaption>Les produits contenus dans ce catalogue.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">REF</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead className="text-right">Prix</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {catalogue.products.map((cat: productType, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{cat.id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell className="text-right">{cat.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}