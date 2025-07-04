"use client"

import { addressType } from "@/actions/addresses/model"
import { MinProductsTable } from "@/components/global/tables/minProductsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/auth-session-client"
import { useEffect } from "react"

export default function SummaryCard(props:{ 
  supplier: any, 
  getCartProducts: () => void, 
  setGroupedSupplier: (prev:any) => void,
  addresses?: addressType[]
}) {
  const user = useUser()
  const message = props.supplier.supplier.metadata?.contentMessage 
    || props.supplier?.supplier?.members?.find((e:any) => user?.user?.id === e.userId)?.contentMessage
    || `Bonjour ${props.supplier.supplier.name}, tu trouveras ci-joint ma dernière commande. Belle journée`

  const handleChange = (data: string) => {
    props.setGroupedSupplier((prev: any[]) =>
      prev.map((supplier) =>
        supplier.supplierId === props.supplier.supplierId
          ? { ...supplier, message: data }
          : supplier
      )
    );
  };

  const selectAddress = (value: string) => {
    props.setGroupedSupplier((prev: any[]) =>
      prev.map((supplier) =>
        supplier.supplierId === props.supplier.supplierId
          ? { ...supplier, addressChoose: value }
          : supplier
      )
    );
  };

  const changeDeliveryMode = (value: string) => {
    props.setGroupedSupplier((prev: any[]) =>
      prev.map((supplier) =>
        supplier.supplierId === props.supplier.supplierId
          ? { ...supplier, deliveryType: value }
          : supplier
      )
    );
  };

  useEffect(() => {
    changeDeliveryMode("DELIVERY")
    selectAddress(props.addresses ? `${props.addresses[0].address} ${props.addresses[0].zipCode} ${props.addresses[0].city}` : "Pas d'adresse selectionné")
    handleChange(message)
  }, [props.addresses])
  
  
  return (
    <Card className="bg-secondary-500">
      <CardHeader>
        <CardTitle>{props.supplier?.supplier.name}</CardTitle>
        <CardDescription>Total : {props.supplier?.totalPriceHt?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€ HT</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 mb-5">
          <div className="pr-10">
            <Label className="mb-2">Méthode de livraison</Label>
            <RadioGroup defaultValue={props.supplier.deliveryType} onValueChange={changeDeliveryMode}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="DELIVERY" id="r1" className="bg-white" />
                <Label htmlFor="r1">Livraison à l'adresse</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="PICKUP" id="r2" className="bg-white" />
                <Label htmlFor="r2">Collect</Label>
              </div>
            </RadioGroup>

            <Label className="mb-2 mt-5">Mon adresse</Label>
            {props.addresses &&
              <Select onValueChange={selectAddress} defaultValue={props.addresses[0].address + " " + props.addresses[0].zipCode + " " + props.addresses[0].city}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Votre adresse" />
                </SelectTrigger>
                <SelectContent>
                  {props.addresses.map((m:any, i) => (
                    <SelectItem key={i} value={m.address + " " + m.zipCode + " " + m.city}>{m.address} {m.zipCode} {m.city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          </div>
          <div>
            <Label className="mb-2">Mon contact</Label>
            <p className="mb-5">{user.user?.email}</p>

            <Label>Informations</Label>
            <Textarea
              className="mt-2 bg-white"
              defaultValue={message}
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