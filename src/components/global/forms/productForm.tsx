"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { categoriesOption, productType } from "@/actions/products/model";
import { Textarea } from "@/components/ui/textarea";
import { createSingleProduct } from "@/actions/products/actions/create";
import { getColSpanClass } from "@/lib/sanitized/class-css";
import { Euro, Percent } from "lucide-react";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiselect";

type InputNames = "name" | "ref" | "price" | "sellQuantity" | "unit" | "tvaValue" | "categories" ;
const inputs: { label: string; defaultValue: string | number; name: InputNames; type: string; col: number, adorment?: any }[] = [
  {
    label: "Ref",
    defaultValue: "",
    name: "ref",
    type: "text",
    col: 1,
  },
  {
    label: "Name",
    defaultValue: "",
    name: "name",
    type: "text",
    col: 3,
  },
  // Price section
  {
    label: "Prix HT à l'unité",
    defaultValue: "",
    name: "price",
    type: "number",
    col: 2,
    adorment: {
      position: "end",
      content: <Euro size={20} />
    }
  },
  {
    label: "Unité",
    defaultValue: "kg",
    name: "unit",
    type: "text",
    col: 1,
  },
  {
    label: "TVA value",
    defaultValue: 5.5,
    name: "tvaValue",
    type: "number",
    col: 1,
    adorment: {
      position: "end",
      content: <Percent size={20} />
    }
  },
  {
    label: "Nombre d'unité vendu par colis",
    defaultValue: 1,
    name: "sellQuantity",
    type: "number",
    col: 2,
    adorment: {
      position: "end",
      content: ""
    }
  }
];

export default function ProductForm(props: {catalogueId: string, setOpen: any, reload: () => void, createByCustomer?: boolean}) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<productType>();

  const onSubmit: SubmitHandler<productType> = async (data) => {
    const formattedData = {
      ref: String(data.ref),
      name: String(data.name),
      description: String(data.description),
      price: typeof data.price === "number" ? data.price 
        : Number.isNaN(Number(String(data.price).replace(',', '.'))) ? 
          0
        : Number(String(data.price).replace(',', '.')),
      catalogueId: props.catalogueId,
      unit: String(data.unit),
      tvaValue: typeof data.tvaValue === "number" ? data.tvaValue 
        : Number.isNaN(Number(String(data.tvaValue).replace(',', '.'))) ? 
          0
        : Number(String(data.tvaValue).replace(',', '.')),
      categories: data.categories || [],
      enabled: true,
      sellQuantity: typeof data.sellQuantity === "number" ? data.sellQuantity 
        : Number.isNaN(Number(String(data.sellQuantity).replace(',', '.'))) ? 
          0
        : Number(String(data.sellQuantity).replace(',', '.')),
    }

    const result = await createSingleProduct({createByCustomer: props.createByCustomer, ...formattedData});
    if (result?.data?.success) {
      props.setOpen(false)
      props.reload()
    } else {
      handleFormErrors(result, setError);
    }
  };

  return (
    <div>
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <div className="grid grid-cols-4 gap-4">
          {inputs.map((input, index) => (
            <div key={index} className={`${getColSpanClass(input.col)} space-y-2`}>
              <Label htmlFor={input.name}>{input.label}</Label>
              <div className="relative">
                <Input 
                  {...register(input.name)}
                  type={input.type}
                  defaultValue={input.defaultValue} 
                  step={input.type === "number" ? ".01" : undefined}
                />
                {input.adorment?.position === "end" &&
                  <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    {input.adorment.content ? input.adorment.content : watch("unit")}
                  </div>
                }
              </div>
            </div>
          ))}
          <div className="col-span-4 *:not-first:mt-2">
            <Label>Catégories</Label>
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => {
                const selectedOptions = value?.map(v => {
                  const option = categoriesOption.find(opt => opt.value === v);
                  return option || { value: v, label: v };
                }) || [];
                
                return (
                  <MultipleSelector
                    commandProps={{
                      label: "Liste des catégories",
                    }}
                    value={selectedOptions}
                    defaultOptions={categoriesOption}
                    placeholder="Sélectionner au moins une catégorie"
                    hidePlaceholderWhenSelected
                    emptyIndicator={<p className="text-center text-sm">Pas de résultat trouvé</p>}
                    onChange={(options) => onChange(options.map(opt => opt.value))}
                  />
                );
              }}
            />
          </div>
          <div className={`col-span-4`}>
            <Label className="mb-2">Description</Label>
            <Textarea 
              {...register("description")} 
            />
            {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description?.message}</p>}
          </div>
          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              Créer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}