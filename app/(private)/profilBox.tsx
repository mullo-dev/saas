import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import { unauthorized } from "next/navigation";

export default async function ProfilBox() {
  const user = await getUser()

  if (!user) {
    unauthorized()
  }

  console.log(user)

  return (
    <Card className="bg-blue-200 w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{user.name}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card>
  )
}