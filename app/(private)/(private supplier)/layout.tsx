import { Header } from "@/components/global/header/header";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect, unauthorized } from "next/navigation";

export default async function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()

  if (!user) {
    unauthorized()
  }

  const fullUser = await prisma.user.findUnique({where: {id:user?.user?.id}, select: {type: true}})

  if (fullUser?.type === "CUSTOMER") {
    redirect("/suppliers")
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