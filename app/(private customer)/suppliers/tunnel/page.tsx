"use client"

import SummaryCard from "./summaryCard";
import TotalCard from "./totalCard";
import { useEffect, useState } from "react";
import { GroupedAupplierAndGetPrice } from "@/actions/products/actions";

export default function tunnelPage() {
  const [groupedSupplier, setGroupedSupplier] = useState<any[]>([])
  
  const getCartProducts = async () => {
    const response = await GroupedAupplierAndGetPrice()
    if (response?.data) {
      setGroupedSupplier(response.data.groupedArray)
    }
  }

  useEffect(() => {
    getCartProducts()
  }, [])

  return (
    <div>
      <h2 className="font-bold text-xl">Finalisez votre commande</h2>
      <div className="flex gap-4 mt-4">
        <div className="flex-1">
          {groupedSupplier.map((supplier: any, index:number) => (
            <SummaryCard key={index} supplier={supplier} />
          ))}

        </div>
        <div className="w-96">
          <TotalCard suppliers={groupedSupplier} />
        </div>
      </div>
    </div>
  )

}