import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCatalogueById } from "@/actions/catalogue/actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CatalogueCard(props: { catalogueId?: string }) {
  const [catalogue, setCatalogue] = useState<any>(null);

  useEffect(() => {
    const fetchCatalogue = async () => {
      if (props.catalogueId) {
        const org = await getCatalogueById({catalogueId: props.catalogueId})
        setCatalogue(org?.data?.catalogue);
      }
    };
    fetchCatalogue();
  }, [props.catalogueId, toast]);

  if (!catalogue) {
    return <p>Aucun catalogue</p>
  }

  return (
    <div className="mt-2 flex justify-between">
      <h4>{catalogue.name}</h4>
      <Link href={`/dashboard/catalogues/${props.catalogueId}`} className={buttonVariants({variant: "outline"})}>
        Consulter
      </Link>
    </div>
  )
}