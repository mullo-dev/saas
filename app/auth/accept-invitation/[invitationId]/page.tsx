"use client"

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { checkEmail } from "@/actions/members/actions/get";
import { acceptInvitation } from "@/actions/invitations/actions/accept";

export default function SignIn() {
  const { invitationId } = useParams()
  const searchParams = useSearchParams()
  const findEmail = searchParams.get('email')
  const findRole = searchParams.get('role')
  const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState(findEmail ? findEmail : "");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [loading, setLoading] = useState(false);
  const [alreadyExist, setAlreadyExist] = useState(false);
	const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (findEmail) {
        const result = await checkEmail(findEmail)
        setAlreadyExist(result)
      }
    }
    check()
  }, [])
  

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Invitation</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {alreadyExist ? "Valider l'invitation" : "Finalisez votre inscription"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {!alreadyExist &&
            <>
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                />
              </div>
            </>
          }

					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
              disabled
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
						/>
					</div>
          
          {!alreadyExist ?
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  await signUp.email({
                    email,
                    password,
                    name: `${firstName} ${lastName}`,
                    callbackURL: "/dashboard",
                    type: findRole !== "customer" ? "SUPPLIER" : "CUSTOMER",
                    fetchOptions: {
                      onResponse: () => {
                        setLoading(false);
                      },
                      onRequest: () => {
                        setLoading(true);
                      },
                      onError: (ctx) => {
                        toast.error(ctx.error.message);
                      },
                      onSuccess: async () => {
                        await signIn.email({ email, password }, {
                          onRequest: () => {
                            setLoading(true);
                          },
                          onResponse: () => {
                            setLoading(false);
                          },
                          onSuccess: async () => {
                            const result = await acceptInvitation({ invitationId: invitationId as string })
                            if (result?.data?.success) {
                              toast.success("Invitation validée")
                            } else (
                              toast.success("Votre compte est créé mais une erreur est survenu lors de la validation de l'invitaion")
                            )
                            router.push("/dashboard")
                          }
                        });
                      },
                    },
                  });
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Valider"
                )}
              </Button>
            </>
          :
            <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  const { data, error } = await signIn.email({ email, password }, {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onSuccess: async () => {
                      const result = await acceptInvitation({ invitationId: invitationId as string })
                      if (result?.data?.success) {
                        toast.success("Invitation validée !")
                      } else (
                        toast.success("Une erreur est survenue lors de la validation de l'invitaion")
                      )
                      router.push("/dashboard")
                    }
                  });
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Se connecter et rejoindre"
                )}
              </Button>
            }

        </div>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4 mt-4">
            <p className="text-center text-xs text-neutral-500">
              Vous souhaitez refuser l'invitation ? <Link href={"/auth/sign-up"} className="text-orange-400">refuser</Link>
            </p>
          </div>
        </CardFooter>
      </CardContent>
    </>
  );
}