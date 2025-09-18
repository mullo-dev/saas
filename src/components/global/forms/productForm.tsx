"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { categoriesOption, productType } from "@/actions/products/model";
import { Textarea } from "@/components/ui/textarea";
import { createSingleProduct } from "@/actions/products/actions/create";
import { getColSpanClass } from "@/lib/sanitized/class-css";
import { Euro, Percent, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiselect";
import { Product } from "@prisma/client";
import { getProductById } from "@/actions/products/actions/get";
import { updateProduct } from "@/actions/products/actions/update";
import { deleteProduct } from "@/actions/products/actions/delete";

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

export default function ProductForm(props: {productId?: string, catalogueId: string, setOpen: any, reload?: () => void, createByCustomer?: boolean}) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm<productType>({
    defaultValues: {
      ref: "",
      name: "",
      description: "",
      price: 0,
      unit: "kg",
      tvaValue: 5.5,
      categories: [],
      sellQuantity: 1,
    },
  });

  useEffect(() => {
    const loadAndFill = async () => {
      if (!props.productId) return;
      const result = await getProductById({ productId: props.productId as string });
      const product: any = result?.data?.product;
      if (!product) return;

      const fields: (keyof productType)[] = [
        "ref",
        "name",
        "description",
        "price",
        "unit",
        "tvaValue",
        "sellQuantity",
        "categories",
      ];

      fields.forEach((field) => {
        let value: any = product[field as string];
        if (field === "price" || field === "tvaValue" || field === "sellQuantity") {
          value = typeof value === "number" ? value : Number(String(value ?? 0).replace(",", "."));
        }
        if (field === "categories") {
          value = Array.isArray(value) ? value : [];
        }
        (setValue as any)(field, value, { shouldDirty: false, shouldTouch: false });
      });
    };

    loadAndFill();
  }, [props.productId, setValue])

  const onDelete = async () => {
    if (props.productId) {
      const result = await deleteProduct({productId: props.productId})
      if (result?.data?.success) {
        props.setOpen(false)
        props.reload && props.reload()
      } else {
        handleFormErrors(result, setError);
      }
    }
  }

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

    if (props.productId) {
      const result = await updateProduct({productId: props.productId, ...formattedData})
      if (result?.data?.success) {
        props.setOpen(false)
        props.reload && props.reload()
      } else {
        handleFormErrors(result, setError);
      }
    } else {
      const result = await createSingleProduct({createByCustomer: props.createByCustomer, ...formattedData});
      if (result?.data?.success) {
        props.setOpen(false)
        props.reload && props.reload()
      } else {
        handleFormErrors(result, setError);
      }
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
          <div className="col-span-4">
            <div className="flex justify-between">
              {props.productId && 
                <Button size="icon" variant="destructive" onClick={() => onDelete()}>
                  <Trash2 />
                </Button>
              }
              <Button type="submit" onClick={() => clearErrors()}>
                {props.productId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}