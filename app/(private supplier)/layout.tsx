import { Header } from "@/components/global/header/header";
import { getUser } from "@/lib/auth-session";
import { unauthorized } from "next/navigation";

export default async function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()

  if (!user) {
    unauthorized()
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