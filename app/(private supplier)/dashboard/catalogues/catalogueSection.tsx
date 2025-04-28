import CatalogueCard from "./catalogueCard";
import { getOrganizationCatalogue } from "@/actions/catalogue/actions";
import DrawerCatalogue from "@/components/global/forms/catalogueForm";

export default async function CatalogueSection(props: {organizationId: string}) {
  const result = await getOrganizationCatalogue({ organizationId: props.organizationId });

  if (!result?.data?.success || !result.data.catalogues) {
    return <p>Erreur lors du chargement des catalogues</p>;
  }
  
  const catalogues = result.data.catalogues;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-md">Vos catalogues</h4>
        <DrawerCatalogue organizationId={props.organizationId} />
      </div>
      <hr />

      {catalogues.map((cat, index) => (
        <CatalogueCard key={index} catalogue={cat} />
      ))}
    </div>
  )
}