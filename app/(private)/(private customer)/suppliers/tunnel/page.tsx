"use client"

import SummaryCard from "./summaryCard";
import TotalCard from "./totalCard";
import { useEffect, useState } from "react";
import { GroupedSupplierAndGetPrice } from "@/actions/organization/actions/get";
import { usePageTitle } from "@/lib/context/pageTitle";

export default function tunnelPage() {
  const [groupedSupplier, setGroupedSupplier] = useState<any[]>([])
  const { setTitle } = usePageTitle();
  
  const getCartProducts = async () => {
    const response = await GroupedSupplierAndGetPrice()
    if (response?.data) {
      setGroupedSupplier(response.data.groupedArray)
    }
  }

  useEffect(() => {
    getCartProducts()
    setTitle("Finaliser la commande");
  }, [])

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="font-bold text-lg">Détails de la commande</h2>
        {groupedSupplier.map((supplier: any, index:number) => (
          <SummaryCard key={index} supplier={supplier} getCartProducts={getCartProducts} />
        ))}
      </div>
      <div className="w-full lg:w-96">
        <TotalCard suppliers={groupedSupplier} />
      </div>
    </div>
  )

}