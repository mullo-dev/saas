"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { ChevronLeft, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ForgetPasswordContent() {
  const [emailSend, setEmailSend] = useState(false) 
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter()
  
  if (!token) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {emailSend ? "Email envoyé !" : "Modifier votre mot de passe"}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {emailSend ? 
              "Cliquer sur le lien de réinitialisation dans le mail." 
            : 
              "Vous recevrez un mail pour réinitialiser votre mot de passe."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSend ?
            <CircleCheckBig size={40} className="text-green-300" />
          :
            <>
              <form
                className="flex flex-col gap-4"
                action={async (formData) => {
                  const email = formData.get("email");
                  await authClient.forgetPassword({
                    email: email as string,
                    redirectTo: "/auth/forget-password"
                  },
                  { 
                    onError: (ctx) => {
                      toast.error(ctx.error.message)
                    },
                    onSuccess: () => {
                      setEmailSend(true)
                    }
                  })
                }}
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email"
                />
                <Button type="submit">Valider</Button>
              </form>
              <Link className={buttonVariants({ variant: "ghost" }) + " mt-2"} href="/auth/sign-in"><ChevronLeft />Retour</Link>
            </>
          }
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Modifier votre mot de passe
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Choisir un nouveau mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            action={async (formData) => {
              const password = formData.get("password");
              await authClient.resetPassword({
                newPassword: password as string,
                token: token
              },
              { 
                onError: (ctx) => {
                  toast.error(ctx.error.message)
                },
                onSuccess: () => {
                  router.refresh()
                  router.push("/auth/sign-in")
                }
              })
            }} 
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
              placeholder="New password"
            />
            <Button type="submit">Valider le nouveau mot de passe</Button>
          </form>
        </CardContent>
    </>
  )
}

export default function ForgetPassword() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ForgetPasswordContent />
    </Suspense>
  );
}