import { getUser } from "@/lib/auth-session"
import { redirect } from "next/navigation"
 
export default async function Auth() {
  const user = await getUser()

  if(!user) {
    redirect("/auth/sign-in")
  }

  console.log(user)

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
    </div>
  )
}