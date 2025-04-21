"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createOrganization } from "@/actions/organization/actions";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { organizationType } from "@/actions/organization/model";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";

type InputNames = "name" | "slug" ;
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; col: number }[] = [
  {
    label: "Name",
    defaultValue: "",
    name: "name",
    type: "text",
    col: 2,
  },
  {
    label: "Url",
    defaultValue: "",
    name: "slug",
    type: "text",
    col: 2,
  },
];

export default function OrganizationForm(props: { organization?: organizationType, setOpen: any }) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<organizationType>();

  const onSubmit: SubmitHandler<organizationType> = async (data) => {
    let result

    if (props.organization) {
      // Update to put here
      result = await createOrganization(data);
    } else {
      result = await createOrganization(data);
    }
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
                  defaultValue={props.organization && (props.organization[input.name] as string)} 
                />
                {errors[input.name] && <p className="text-red-500 mt-1 text-sm">{errors[input.name]?.message}</p>}
              </Label>
            </div>
          ))}
          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              {props.organization ? "update" : "create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}