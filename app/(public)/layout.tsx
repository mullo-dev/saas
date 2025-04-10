import { Header } from "@/components/global/header/header";

export default function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <Header />
      <div className="container">
        {children}
      </div>
    </div>
  )
}