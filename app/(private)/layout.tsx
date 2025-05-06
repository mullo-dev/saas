import { Header } from "@/components/global/header/header";

export default async function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="px-2 pb-5 md:px-0">
      <Header />
      <div className="container m-auto mt-5">
        {children}
      </div>
    </div>
  )
}