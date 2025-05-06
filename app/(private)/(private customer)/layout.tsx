import { getUser } from "@/lib/auth-session";
import { redirect, unauthorized } from "next/navigation";

export default async function LayoutPrivateCustomer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser()

  if (!user) {
    unauthorized()
  }

  if (user?.type === "SUPPLIER") {
    redirect("/dashboard")
  }

  return children
}