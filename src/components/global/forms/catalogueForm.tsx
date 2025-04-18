"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Catalogue } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { organizationType } from "@/actions/organization/model";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { createCatalogue } from "@/actions/catalogue/actions";
import { toast } from "sonner";

type InputNames = "name";
const inputs: { label: string; defaultValue: string; name: InputNames; type: string; col: number }[] = [
  {
    label: "Name",
    defaultValue: "",
    name: "name",
    type: "text",
    col: 2,
  },
];

export default function CatalogueForm(props: { organizationId?: string, catalogue?: Catalogue, setOpen: any }) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<organizationType>();

  const onSubmit: SubmitHandler<organizationType> = async (data) => {
    if (!props.organizationId) {
      return setError("root", { type: "manual", message: "L'entreprise n'a pas été trouvée." })
    }

    let result
    if (props.catalogue) {
      result = await createCatalogue({organizationId: props.organizationId, ...data});
    } else {
      result = await createCatalogue({organizationId: props.organizationId, ...data});
    }
    if (result?.data?.success) {
      toast.success("Catalogue créé !")
      props.setOpen(false)
    } else {
      toast.error("Oups une erreur est survenue...")
      handleFormErrors(result, setError);
    }
  };


  if (!props.organizationId) {
    <p className="text-destructive">Vous devez être rataché à une entreprise pour effectuer cette action.</p>
  }

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
                  defaultValue={props.catalogue && (props.catalogue[input.name] as string)} 
                />
                {errors[input.name] && <p className="text-red-500 mt-1 text-sm">{errors[input.name]?.message}</p>}
              </Label>
            </div>
          ))}
          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              {props.catalogue ? "update" : "create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}