"use client"

import SignInForm from "../../../src/components/global/forms/signInForm";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useUser } from "@/lib/auth-session-client";
import { Button } from "@/components/ui/button";
import { acceptRequestMember } from "@/actions/members/actions";
import { getUserById } from "@/actions/user/action";
import { toast } from "sonner";

export default function SignIn() {
  const { user, isPending } = useUser();
  const searchParams = useSearchParams()
  const ownerId = searchParams.get('owner')
  const customerId = searchParams.get('customer')
  const organizationId = searchParams.get('organization')
  const [signInRequired, setSignInRequired] = useState(true)
  const [customer, setCustomer] = useState<any>()
  const route = useRouter()

  
  const signOutForSignIn = async () => {
    await signOut();
    route.refresh()
  }
  
  const findCustomer = async () => {
    const result = await getUserById({userId: customerId as string})
    setCustomer(result?.data?.user)
  }
  
  useEffect(() => {
    if (!user) {
      setSignInRequired(true)
    } else if (user.id !== ownerId) {
      signOutForSignIn()
      setSignInRequired(true)
    } else {
      setSignInRequired(false)
      findCustomer()
    }
  }, [user, isPending])

  const accept = async () => {
    const result = await acceptRequestMember({
      organizationId: organizationId as string, 
      customerId: customerId as string
    })
    if (result?.data?.success) {
      toast.success("Demande acceptée")
      route.push('/dashboard')
    } else {
      toast.error("Une erreur est survenue")
    }
  }
  
  return (
    <>
      {signInRequired || !user ?
        <SignInForm redirectPath={window.location.href} />
      : 
        <>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{customer?.name} veut vous rejoindre</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Voulez-vous accepter sa demande d'inscription en tant que client ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="bg-gray-100 p-3 rounded-lg text-sm">
              Une fois accepté vous pourrez assigner un catalogue à {customer?.name} pour qu'il puisse s'approvisionner chez vous.
            </p>
            <Button className="w-full mt-8" onClick={() => accept()}>
              Accepter
            </Button>
          </CardContent>
        </>
      }
    </>
  );
}