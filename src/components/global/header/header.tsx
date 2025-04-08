import { Button, buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getUser } from "@/lib/auth-session";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { AuthButton } from "../auth/auth-button";

export async function Header() {
  const user = await getUser()

  return (
    <div className="bg-amber-300 flex py-4 px-10 items-center justify-between">
      <div>Work Travel</div>
      {user ?
        <form>
          <Button
            variant="outline"
            formAction={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              })
              redirect("/auth/sign-in")
            }}
          >
            Sign out
          </Button>
        </form>
      :
        <Link className={buttonVariants({ variant: "outline" })} href="/auth/sign-in">
          Sign In
        </Link>
      }
      {/* <AuthButton /> */}
    </div>
  )
}

{/* <Button
          variant="outline"
          className="cursor-pointer"
          onClick={async () => {
            "use server";
            console.log('ici')
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  console.log("test")
                  redirect("auth/sign-in")
                },
                onError: (e) => console.log(e)
              }
            })
          }}
        >
          Sign out
        </Button> */}