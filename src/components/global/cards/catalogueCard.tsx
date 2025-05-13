import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Box, User } from "lucide-react";

export default function CatalogueCard({ catalogue }: { catalogue?: any }) {

  return (
    <Link href={`/dashboard/catalogues/${catalogue.id}`}>
      <Card className="bg-primary-500 hover:bg-primary-300">
        <CardContent>
          <CardTitle className="text-white font-bold text-lg mb-4">{catalogue.name}</CardTitle>
          <div className="flex items-center text-white gap-2 text-xs font-bold mb-2">
            <Box size={20} /> {catalogue._count.products} produit{catalogue._count.products > 1 && "s"}
          </div>
          <div className="flex items-center text-white gap-2 text-xs font-bold">
            <User size={20} /> {catalogue._count.subCatalogues} client{catalogue._count.subCatalogues > 1 && "s"}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}