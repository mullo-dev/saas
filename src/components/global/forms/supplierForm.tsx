"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createOrganization } from "@/actions/organization/actions";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supplierType } from "@/actions/organization/model";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";

type InputNames = "name" | "supplierName" | "email" | "phone" ;
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; col: number }[] = [
  {
    label: "Name",
    defaultValue: "",
    name: "name",
    type: "text",
    col: 2,
  },
  {
    label: "Prénom et nom",
    defaultValue: "",
    name: "supplierName",
    type: "text",
    col: 2,
  },
  {
    label: "Email",
    defaultValue: "",
    name: "email",
    type: "text",
    col: 2,
  },
  {
    label: "Téléphone",
    defaultValue: "",
    name: "phone",
    type: "text",
    col: 2,
  },
];

export default function SupplierForm(props: { setOpen: any }) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<supplierType>();

  const onSubmit: SubmitHandler<supplierType> = async (data) => {
    const supplier = {
      createByCustomer: true,
      metadata: {
        email: data.email,
        supplierName: data.supplierName,
        phone: data.phone
      },
      name: data.name,
      slug: data.name + "-fournisseur"
    }
    const result = await createOrganization(supplier);

    if (result?.data?.success) {
      props.setOpen(false)
    } else {
      handleFormErrors(result, setError);
    }
  };

  return (
    <div>
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <div className="grid grid-cols-2 gap-4">
          {inputs.map((input, index) => (
            <div key={index} className={`col-span-${input.col}`}>
              <Label>
                {input.label}
                <Input 
                  {...register(input.name)}
                />
                {errors[input.name] && <p className="text-red-500 mt-1 text-sm">{errors[input.name]?.message}</p>}
              </Label>
            </div>
          ))}
          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              {"Valider"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}