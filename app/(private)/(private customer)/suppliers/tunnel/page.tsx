"use client"

import SummaryCard from "./summaryCard";
import TotalCard from "./totalCard";
import { useEffect, useState } from "react";
import { GroupedSupplierAndGetPrice } from "@/actions/organization/actions/get";
import { usePageTitle } from "@/lib/context/pageTitle";
import { addressType } from "@/actions/addresses/model";
import { getAddresses } from "@/actions/addresses/actions/get";

export default function tunnelPage() {
  const [groupedSupplier, setGroupedSupplier] = useState<any[]>([])
  const [addresses, setAddresses] = useState<addressType[]>()
  const { setTitle } = usePageTitle();
  
  const getCartProducts = async () => {
    const response = await GroupedSupplierAndGetPrice()
    if (response?.data?.success) {
      const suppliers = response.data.groupedArray.map((s: any) => ({
        ...s,
        deliveryType: "DELIVERY"
      }));
      setGroupedSupplier(suppliers)
    }
  }

  const getTheAddresses = async () => {
    const response = await getAddresses()
    if (response?.data?.success) {
      setAddresses(response.data.addresses)
    }
  }

  useEffect(() => {
    getCartProducts()
    setTitle("Finaliser la commande");
    getTheAddresses()
  }, [])

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="font-bold text-lg">Détails de la commande</h2>
        {groupedSupplier.map((supplier: any, index:number) => (
          <SummaryCard 
            key={index}
            supplier={supplier}
            getCartProducts={getCartProducts}
            setGroupedSupplier={setGroupedSupplier}
            addresses={addresses}
            reload={getTheAddresses}
          />
        ))}
      </div>
      <div className="w-full lg:w-96">
        <TotalCard suppliers={groupedSupplier} />
      </div>
    </div>
  )

}