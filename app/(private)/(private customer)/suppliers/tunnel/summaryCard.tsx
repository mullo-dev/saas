"use client"

import { MinProductsTable } from "@/components/global/tables/minProductsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/auth-session-client"

export default function SummaryCard(props:{ supplier: any, getCartProducts: () => void, setGroupedSupplier: (prev:any) => void }) {
  const user = useUser()
  const message = props.supplier.supplier.metadata?.contentMessage 
    || props.supplier?.supplier?.members?.find((e:any) => user?.user?.id === e.userId)?.contentMessage
    || `Bonjour ${props.supplier.supplier.name}, tu trouveras ci-joint ma dernière commande. Belle journée`

  const handleChange = (data: string) => {
    props.setGroupedSupplier((prev: any[]) =>
      prev.map((supplier) =>
        supplier.id === props.supplier.id
          ? { ...supplier, message: data }
          : supplier
      )
    );
  };
  
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
              defaultValue={message }
              onChange={(e) => handleChange(e.target.value)}
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