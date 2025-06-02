import { getUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import Unauthorized from "@app/unauthorized";

export default async function LayoutPrivateSupplier({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser()

  if (!user) {
    return <Unauthorized />
  }

  if (user?.type === "CUSTOMER") {
    redirect("/suppliers")
  }

  return children
}