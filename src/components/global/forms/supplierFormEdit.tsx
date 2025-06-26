"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supplierType } from "@/actions/organization/model";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { simpleUpdateOrganization } from "@/actions/organization/actions/update";
import { updateMemberOrganization } from "@/actions/members/actions/update";
import { useUser } from "@/lib/auth-session-client";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type InputNames = "name" | "supplierName" | "email" | "phone" ;
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; }[] = [
  {
    label: "Nom de l'entreprise",
    defaultValue: "",
    name: "name",
    type: "text",
  },
  {
    label: "Prénom et nom du contact",
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
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  // { value: "whatsapp", label: "WhatsApp" },
];

export default function SupplierFormEdit(props: { 
  organization: any, 
  setOpen: any,
  reload: () => void
}) {
  const {
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<supplierType>({
    defaultValues: {
      name: props.organization.name,
      supplierName: JSON.parse(props.organization.metadata)?.supplierName,
      email: JSON.parse(props.organization.metadata)?.email,
      phone: JSON.parse(props.organization.metadata)?.phone
    }
  });
  const { user } = useUser()
  const member = props.organization.members.find((m:any) => m.userId === user?.id)

  const onSubmit: SubmitHandler<supplierType> = async (data:any) => {
    let result
    if (member.role === "customer") {
      result = await updateMemberOrganization({
        contactPreference: data.contactPreference,
        contactMessage: data.contactMessage,
        memberId: member.id
      })
    } else {
      const supplier = {
        organizationId: props.organization.id,
        metadata: {
          email: data.email,
          supplierName: data.supplierName,
          phone: data.phone,
          contactPreference: data.contactPreference,
          contactMessage: data.contactMessage
        },
        name: data.name
      }
      result = await simpleUpdateOrganization(supplier);
    }

    if (result?.data?.success) {
      props.setOpen(false)
      toast.success("Le fournisseur a été mise à jour.")
      props.reload()
    } else {
      handleFormErrors(result, setError);
      toast.error("Une erreur est survenue...")
    }
  };

  if (!member) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <div className="grid grid-cols-1 gap-5">
          {member.role !== "customer" && inputs.map((input:any, index:number) => (
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
          <div className="grid gap-2">
            <Label>
              Préférence de contact
            </Label>
            <Controller
              name="contactPreference"
              control={control}
              defaultValue={
                member.role === "customer"
                  ? member.contactPreference
                  : JSON.parse(props.organization.metadata || "{}")?.contactPreference || []
              }
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
                          checked={value.includes(option.value)}
                          onCheckedChange={() => toggleValue(option.value)}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>
              Message prédéfini
            </Label>
            <Textarea
              className="bg-white"
              defaultValue={member.role === "customer" ? member.contactMessage : JSON.parse(props.organization.metadata).contactMessage}
              {...register("contactMessage")}
            />
            {errors["contactMessage"] && <p className="text-red-500 mt-1 text-sm">{errors["contactMessage"]?.message}</p>}
          </div>
          <Button type="submit" className="w-full" onClick={() => clearErrors()}>
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}