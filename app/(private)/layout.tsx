import { Header } from "@/components/global/header/header";
import ProfilBox from "./profilBox";
import { Card } from "@/components/ui/card";

export default function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <Header />
      <div className="flex container m-auto gap-6 mt-5">
        <ProfilBox />
        <Card className="flex-1 px-5">
          {children}
        </Card>
      </div>
    </div>
  )
}