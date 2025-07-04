"use client"

import { addressType } from "@/actions/addresses/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressForm from "../forms/addressForm";
import { DrawerDialog } from "../modal";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAddress } from "@/actions/addresses/actions/delete";
import { toast } from "sonner";

export default function AddressCard({ address, add, index, reload }: { 
  address?: addressType, 
  add?: boolean, 
  index?: number,
  reload: () => void 
}) {

  const deleteTheAddress = async () => {
    const confirmed = window.confirm("Es-tu sûr de vouloir supprimer l'adresse ?");
    if (!confirmed) return;

    if (address) {
      const result = await deleteAddress({organizationId: address.organizationId, addressId: address.id})
      if (result?.data?.success) {
        toast.success("Adresse supprimée.")
        reload()
      } else {
        toast.success("Une erreur est survenue.")
      }
    }
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-primary font-bold text-lg flex justify-between">
          {add ? "Ajouter une addresse" 
            : 
            <>
              Adresse {index}
              <div className="flex gap-2">
                <DrawerDialog
                  title="Moddifier l'adresse" 
                  buttonTitle={<Edit />}
                  buttonSize="icon"
                  description="Modifier votre adresse"
                >
                  {(p) => <AddressForm setOpen={p.setOpen} address={address} reload={reload} />}
                </DrawerDialog>
                <Button variant="outline" size="icon" onClick={() => deleteTheAddress()}>
                  <Trash />
                </Button>
              </div>
            </>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        {add ?
          <DrawerDialog
            title="Nouvelle adresse" 
            buttonTitle="Ajouter"
            buttonSize="lg"
            description="Ajoutez votre adresse"
          >
            {(p) => <AddressForm setOpen={p.setOpen} reload={reload} />}
          </DrawerDialog>
          :
          <>
            <div className="flex items-center gap-2 text-sm font-bold mb-2">
              {address?.address}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              {address?.zipCode} - {address?.city}
            </div>
          </>
        }
      </CardContent>
    </Card>
  )
}