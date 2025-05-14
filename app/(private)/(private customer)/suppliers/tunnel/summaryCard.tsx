"use client"

import { MinProductsTable } from "@/components/global/tables/minProductsTable"
import { ProductsTable } from "@/components/global/tables/productsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SummaryCard(props:{ supplier: any, getCartProducts: () => void }) {
  
  return (
    <Card className="bg-secondary-500">
      <CardHeader>
        <CardTitle>{props.supplier?.supplier.name}</CardTitle>
        <CardDescription>Total : {props.supplier?.totalPriceHt?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€ HT</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 mb-5">
          <div>
            <h3 className="font-bold text-sm">Mon adresse</h3>
            <p>34 rue du Cheval blanc</p>
            <p>75018 Papamignon</p>

            <h3 className="font-bold text-sm mt-3">Mon contact</h3>
            <p>09 09 09 09 09</p>
          </div>
          <div>
            <Label>Informations</Label>
            <Textarea
              className="mt-2 bg-white"
              defaultValue={`Bonjour ${props.supplier.supplier.name}, tu trouveras ci-joint ma dernière commande. Belle journée`}
              rows={4}
            />
          </div>
        </div>
        <hr className="border-secondary" />
        <div>
          <h3 className="font-bold text-sm mt-3 mb-2">Produits</h3>
        </div>
        <MinProductsTable 
          supplierId={props.supplier.supplierId} 
          propsData={props.supplier.fullProducts} 
          getCartProducts={props.getCartProducts}
        />
      </CardContent>
    </Card>
  )

}