"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { getColSpanClass } from "@/lib/sanitized/class-css";
import { addressType } from "@/actions/addresses/model";
import { updateAddress } from "@/actions/addresses/actions/update";
import { createAddress } from "@/actions/addresses/actions/create";

type InputNames = "address" | "city" | "zipCode" ;
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; col: number }[] = [
  {
    label: "Adresse",
    defaultValue: "",
    name: "address",
    type: "text",
    col: 2,
  },
  {
    label: "Code postal",
    defaultValue: "",
    name: "zipCode",
    type: "text",
    col: 1,
  },
  {
    label: "Ville",
    defaultValue: "",
    name: "city",
    type: "text",
    col: 1,
  },
];

export default function AddressForm(props: { address?: addressType, setOpen: any, reload: () => void }) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<addressType>();

  const onSubmit: SubmitHandler<addressType> = async (data) => {
    let result
    data.country = "FRANCE"
    
    if (props.address) {
      // Update to put here
      data.organizationId = props.address.organizationId
      data.id = props.address.id
      result = await updateAddress(data);
    } else {
      result = await createAddress(data);
    }
    if (result?.data?.success) {
      props.reload()
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
            <div key={index} className={getColSpanClass(input.col)}>
              <Label>
                {input.label}
                <Input 
                  {...register(input.name)}
                  defaultValue={props.address && (props.address[input.name] as string)} 
                />
                {errors[input.name] && <p className="text-red-500 mt-1 text-sm">{errors[input.name]?.message}</p>}
              </Label>
            </div>
          ))}
          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              {props.address ? "mettre à jour" : "créer"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}