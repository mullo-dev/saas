"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm } from "react-hook-form"
import { updateProduct } from "@/actions/products/actions/update"
import { toast } from "sonner"

export function ExpandPanel(props: {row:any}) {
  const [onChange, setOnChange] = useState<boolean>(false)
  const [tvaValue, setTvaValue] = useState<number>(props.row.original.tvaValue)
  const {
    register,
    // setError,
    // clearErrors,
    reset,
    handleSubmit,
    watch,
    formState: { },
  } = useForm<any>({
    defaultValues: {
      description: props.row.original.description,
      tvaValue: props.row.original.tvaValue,
      unit: props.row.original.unit,
      // sellQuantity: props.row.original.sellQuantity,
      // categories:
    }
  });

  const onSubmit: SubmitHandler<any> = async (data:any) => {
    const result = await updateProduct({
      productId: props.row.original.id,
      ...data
    })
    if (result?.data?.success) {
      toast.success("Produit mis à jour")
      console.log(result.data.product)
      setTvaValue(data.tvaValue)
      setOnChange(false)
    } else {
      console.log(result?.data?.error)
      toast.error('Une erreur est survenue')
    }
  };
  
  return (
    <form className="pb-4 pl-2 pr-4 text-dark" onSubmit={handleSubmit(onSubmit)}>
      <hr/>
      <div className="flex flex-wrap gap-4 pt-4">
        <div>
          <Label className="text-sm">Description</Label>
          <Textarea 
            {...register('description')}
            onChange={() => setOnChange(true)}
            defaultValue={watch('description')}
            className="bg-white mt-2"
            rows={4}
            cols={35}
          />
        </div>
        {/* <div>
          <Label className="text-sm">Catégorie</Label>
          <span className="italic text-muted-foreground text-xs">Séparez les catégories par des virgules</span>
          <Textarea 
            {...register('categories')}
            onChange={() => setOnChange(true)}
            defaultValue={[watch('categories')]}
            className="bg-white mt-2"
            rows={3}
            cols={30}
          />
        </div> */}
        <div>
          <Label className="text-sm">Unité</Label>
          <Input
            {...register('unit')}
            onChange={() => setOnChange(true)}
            defaultValue={watch('unit')}
            className="bg-white mt-1"
          />
          <hr />
          <Label className="mt-2 text-sm">Quantité par colis</Label>
          <Input
            // {...register('sellQuantity')}
            onChange={() => setOnChange(true)}
            defaultValue={1}
            className="bg-white mt-1"
            type="number"
            min={0}
          />
        </div>
        <div>
          <Label className="text-sm">TVA</Label>
          <Select 
            defaultValue={String(tvaValue)}
            onValueChange={(value:any) => {
              setOnChange(true)
              setTvaValue(Number(value))
            }}
            {...register('tvaValue')}
          >
            <SelectTrigger className="w-[180px] bg-white mt-2">
              <SelectValue placeholder="Taux de TVA" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"20"}>20%</SelectItem>
                <SelectItem value={"10"}>10%</SelectItem>
                <SelectItem value={"5.5"}>5,5%</SelectItem>
                <SelectItem value={"0"}>0%</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="mt-2 ml-1 text-xs text-muted-foreground italic">
            TVA : {(props.row.original.price*tvaValue/100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'}
          </p>
          <p className="mt-2 ml-1 font-bold">
            {(props.row.original.price+(props.row.original.price*tvaValue/100)).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€ TTC'}
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <Button 
          size="sm"
          disabled={!onChange}
          type="submit"
        >
          Valider
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          disabled={!onChange}
          onClick={() => {
            setOnChange(false)
            setTvaValue(props.row.original.tvaValue)
            reset()
          }}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
