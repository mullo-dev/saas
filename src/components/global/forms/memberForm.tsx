"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { addMemberToOrganization, editMemberToOrganization } from "@/actions/members/actions";
import { Button } from "@/components/ui/button";
import { memberType } from "@/actions/members/model";
import { MemberRole } from "@prisma/client"
import { getUsers } from "@/actions/user/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usersType } from "@/actions/user/model";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";

const roleLabels: Record<MemberRole, string> = {
  ADMIN: "Administrateur",
  MEMBER: "Membre",
  EDITOR: "Editeur",
};
const rolesWithLabels = Object.values(MemberRole).map((role) => ({
  value: role,
  label: roleLabels[role],
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
      userId: props.member && props.member.userId,
    },
  });
  const [users, setUsers] = useState<usersType[]>()

  useEffect(() => {
    const returnUsers = async () => {
      const response = await getUsers()
      if (response?.data?.success) {
        setUsers(response.data.users)
      }
    }
    returnUsers()
  }, [])
  
  const onSubmit: SubmitHandler<memberType> = async (data) => {
    let result
    if (props.member) {
      result = await editMemberToOrganization({
        organizationId: props.organizationId,
        userId: props.member.userId,
        role: data.role
      });
    } else {
      result = await addMemberToOrganization({
        organizationId: props.organizationId,
        userId: data.userId,
        role: data.role
      });
    }
    if (result?.data?.success) {
      toast.success(props.member ? "Membre mis à jour" : "Membre créé")
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
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user, i) => (
                        <SelectItem key={i} value={user.id}>{user.name + ' - ' + user.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.userId && <p className="text-red-500 mt-1 text-sm">{errors.userId.message}</p>}
                </>
              )}
            />
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
              {props.member ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}