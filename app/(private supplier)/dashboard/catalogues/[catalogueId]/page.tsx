"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCatalogueById } from "@/actions/catalogue/actions";
import { useParams } from "next/navigation";
import { TricksTable } from "@/components/csv-importer/tricks-table";
import { Shell } from "@/components/csv-importer/shell";

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
      <Shell>
        <TricksTable propsData={catalogue.products} />
      </Shell>
    </div>
  )
}