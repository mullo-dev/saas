"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { memberType } from "@/actions/members/model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMember } from "@/actions/invitations/actions/create";

const rolesWithLabels = Object.values(["member", "admin", "owner"]).map((role) => ({
  value: role,
  label: role,
}));

export default function MemberForm(props: { organizationId: string, setOpen: any, member?: memberType }) {
  const {
    register,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<memberType>({
    defaultValues: {
      role: props.member && props.member.role,
      email: props.member && props.member.email,
    },
  });
  
  const onSubmit: SubmitHandler<memberType> = async (data) => {
    let result
    if (props.member) {
      // Edit here
    } else {
      result = await inviteMember({
        organizationId: props.organizationId,
        email: data.email,
        role: data.role
      });
    }
    if (result?.data?.success) {
      toast.success(props.member ? "Membre mis à jour" : "Invitation envoyé")
      props.setOpen(false)
    } else {
      handleFormErrors(result, setError);
      toast.error("Une erreur est survenue")
    }
  };

  return (
    <div>
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>
              Email
              <Input {...register("email")} />
              {errors["email"] && <p className="text-red-500 mt-1 text-sm">{errors["email"]?.message}</p>}
            </Label>
          </div>
          <div className="col-span-2">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesWithLabels.map((m, i) => (
                        <SelectItem key={i} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 mt-1 text-sm">{errors.role.message}</p>}
                </>
              )}
            />
          </div>

          <div className="cols-span-2">
            <Button type="submit" onClick={() => clearErrors()}>
              {props.member ? "Mettre à jour" : "Envoyer l'invitation"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}