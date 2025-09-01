"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { createOrganization } from "@/actions/organization/actions/create";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supplierType } from "@/actions/organization/model";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { getUsers } from "@/actions/user/actions/get";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendRequestMember } from "@/actions/invitations/actions/create";
import { UserTypeEnum } from "@/actions/user/model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type InputNames = "name" | "supplierName" | "email" | "phone" ;
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; }[] = [
  {
    label: "Name",
    defaultValue: "",
    name: "name",
    type: "text",
  },
  {
    label: "Prénom et nom",
    defaultValue: "",
    name: "supplierName",
    type: "text",
  },
  {
    label: "Email",
    defaultValue: "",
    name: "email",
    type: "text",
  },
  {
    label: "Téléphone",
    defaultValue: "",
    name: "phone",
    type: "text",
  },
];

const contactOptions = [
  { value: "email", label: "Email", disabled: false },
  { value: "sms", label: "SMS", disabled: true },
  // { value: "whatsapp", label: "WhatsApp" },
];

export default function SupplierForm(props: { setOpen: any, reload: () => void }) {
  const {
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<supplierType>();
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [returnSuppliers, setReturnSuppliers] = useState<any[]>([])

  
  const getSuppliersAvailable = async () => {
    const result = await getUsers({searchType: UserTypeEnum.SUPPLIER})
    if (result?.data?.success) {
      let table = [] as any
      result.data.users?.map((s:any) => {
        s.members[0] && table.push({
          organizationId: s.members[0].organizationId,
          organizationName: s.members[0].organization.name,
          supplierName: s.name,
          supplierEmail: s.email,
          supplierId: s.id
        })
      })
      setSuppliers(table ?? [])
    }
  }


  useEffect(() => {
    getSuppliersAvailable()
  }, [])


  const searchInArray = (searchTerm:string) => {
    if (searchTerm.length >= 4 && suppliers && suppliers.length > 0) {
      const filtered = suppliers.filter((sup: any) =>
        sup.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Only update state if the filtered result changes, prevent infinite loops
      if (JSON.stringify(filtered) !== JSON.stringify(returnSuppliers)) {
        setReturnSuppliers(filtered);
      }
    } else if (returnSuppliers.length !== 0) {
      setReturnSuppliers([]);
    }
  }


  const sendRequestInvitation = async (supplier:any) => {
    const send = await sendRequestMember({
      organizationId: supplier.organizationId,
      supplierId: supplier.supplierId,
      supplierEmail: supplier.supplierEmail
    })
    if (send?.data?.success) {
      toast.success("Demande de connexion envoyé")
      props.setOpen(false)
      props.reload()
    } else {
      toast.error("Une erreur est survenue")
    }
  }
  

  const onSubmit: SubmitHandler<supplierType> = async (data:any) => {
    const supplier = {
      createByCustomer: true,
      metadata: {
        email: data.email,
        supplierName: data.supplierName,
        phone: data.phone,
        contactPreference: data.contactPreference
      },
      name: data.name,
      slug: data.name.toLocaleLowerCase().replace(' ', '-')
    }
    const result = await createOrganization(supplier);

    if (result?.data?.success) {
      props.setOpen(false)
      props.reload()
    } else {
      handleFormErrors(result, setError);
    }
  };


  return (
    <div>
      <Tabs defaultValue="supplier">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supplier">Trouver un fournisseur</TabsTrigger>
          <TabsTrigger value="createSupplier">Créer un fournisseur</TabsTrigger>
        </TabsList>
        <TabsContent value="supplier">
          <div className="bg-gray-100 rounded-md mb-2 p-2">
            <h3 className="text-sm text-gray-900 mt-1 mb-2 font-bold">Cherchez un fournisseur déjà inscrit sur Mullo.</h3>
            <Input placeholder="Nom, email..." className="bg-white text-sm" onChange={(e) => searchInArray(e.target.value)} />
            <div className="h-56 overflow-scroll">
              <ul className="grid gap-2 mt-2">
                {returnSuppliers.map((sup) => (
                  <li 
                    className="bg-white rounded-md p-2 flex flex-col cursor-pointer hover:bg-green-50"
                    onClick={() => sendRequestInvitation(sup)}
                  >
                    <span className="text-sm font-bold">{sup.organizationName}</span>
                    <span className="text-xs font-bol">{sup.supplierName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button className="w-full">Ajouter</Button>
        </TabsContent>
        <TabsContent value="createSupplier">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-100 rounded-md mb-2 p-2">
              <h3 className="text-sm text-gray-900 mt-1 mb-2 font-bold">Ajoutez sur votre compte un fournisseur externe.</h3>
              {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
              <div className="grid grid-cols-1 gap-2">
                {inputs.map((input:any, index:number) => (
                  <div key={index} className="grid gap-2">
                    <Label>
                      {input.label}
                    </Label>
                    <Input
                      className="bg-white"
                      {...register(input.name)}
                    />
                    {errors[input.name as keyof typeof errors] && <p className="text-red-500 mt-1 text-sm">{errors[input.name as keyof typeof errors]?.message}</p>}
                  </div>
                ))}
                <Controller
                  name="contactPreference"
                  control={control}
                  render={({ field }) => {
                    const value: string[] = field.value || [];

                    const toggleValue = (option: string) => {
                      const newValue = value.includes(option)
                        ? value.filter((v) => v !== option)
                        : [...value, option];
                      field.onChange(newValue);
                    };

                    return (
                      <div className="space-y-2">
                        {contactOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.value}
                              checked={option.disabled ? false :value.includes(option.value)}
                              onCheckedChange={() => toggleValue(option.value)}
                              disabled={option.disabled}
                            />
                            <Label htmlFor={option.value}>
                            {option.label}
                            {option.disabled && <span className="text-red-500 text-sm">Pas encore disponible</span>}
                          </Label>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" onClick={() => clearErrors()}>
              Valider
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}