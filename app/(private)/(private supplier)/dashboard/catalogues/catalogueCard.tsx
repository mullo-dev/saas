import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CatalogueCard({ catalogue }: { catalogue?: any }) {

  if (!catalogue) {
    return <p>Aucun catalogue</p>
  }

  return (
    <div className="mt-2 flex justify-between">
      <h4>{catalogue.name}</h4>
      <Link href={`/dashboard/catalogues/${catalogue.id}`} className={buttonVariants({variant: "outline"})}>
        Consulter
      </Link>
    </div>
  )
}