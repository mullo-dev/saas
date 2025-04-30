import { Header } from "@/components/global/header/header";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect, unauthorized } from "next/navigation";

export default async function LayoutPrivate({
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

  return (
    <div>
      <Header />
      <div className="container m-auto mt-5">
        {children}
      </div>
    </div>
  )
}