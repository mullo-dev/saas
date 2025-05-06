import { getUser } from "@/lib/auth-session";
import { redirect, unauthorized } from "next/navigation";

export default async function LayoutPrivateSupplier({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser()

  if (!user) {
    return unauthorized()
  }

  if (user.type === "CUSTOMER") {
    redirect("/suppliers")
  }

  return children
}