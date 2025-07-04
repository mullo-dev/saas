"use client"

import { useState, useEffect } from "react";
import { getAddresses } from "@/actions/addresses/actions/get";
import { addressType } from "@/actions/addresses/model";
import AddressCard from "@/components/global/cards/addressCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/auth-session-client";
import { DrawerDialog } from "@/components/global/modal";
import AddressForm from "@/components/global/forms/addressForm";

export default function ProfilPage() {
  const user = useUser()
  const [addresses, setAddresses] = useState<addressType[]>()

  const getOrganizationAddresses = async () => {
    const result = await getAddresses()
    if (result?.data?.success) {
      setAddresses(result?.data?.addresses)
    }
  }

  useEffect(() => {
    getOrganizationAddresses()
  }, [])
  
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Profil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <p>Nom : {user.user?.name}</p>
            <p>Email : {user.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between align-items mt-10  mb-3">
        <h2 className="text-2xl font-bold">Vos adresses</h2>
        <DrawerDialog
          title="Nouvelle adresse" 
          buttonTitle="Ajouter"
          buttonSize="lg"
          description="Ajoutez votre adresse"
        >
          {(p) => <AddressForm setOpen={p.setOpen} reload={getOrganizationAddresses} />}
        </DrawerDialog>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {addresses && addresses?.length > 0 ? addresses.map((address:addressType, index:number) => (
          <AddressCard key={index} index={index+1} address={address} reload={getOrganizationAddresses} />
        )) : 
          <Card className="col-span-4">
            <CardContent className="text-center">
              <p className="text-center mb-5 font-bold text-lg text-accent">Vous n'avez pas encore d'adresse enregistrée.</p>
              <DrawerDialog
                title="Nouvelle adresse" 
                buttonTitle="Ajouter"
                buttonSize="lg"
                description="Ajoutez votre adresse"
              >
                {(p) => <AddressForm setOpen={p.setOpen} reload={getOrganizationAddresses} />}
              </DrawerDialog>
            </CardContent>
          </Card>
        }
      </div>
    </div>
  )
}