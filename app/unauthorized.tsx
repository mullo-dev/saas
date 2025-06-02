import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function unauthorized() {

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <Alert variant="destructive" className="w-full max-w-lg">
        <AlertTitle className="text-lg">Impossible de charger la page</AlertTitle>
        <AlertDescription className="mt-2">
          Vous n'êtes pas autorisé à accéder à cette page. Veuillez vous connecter pour continuer.
          <Link href={"/auth/sign-in"} className={`mt-4 ${buttonVariants({ variant: "secondary", size: "sm" })}`}>
            Se connecter
          </Link>
        </AlertDescription>
      </Alert>
    </div>
  )
}