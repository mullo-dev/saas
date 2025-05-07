import { Header } from "@/components/global/header/header";
import { SubHeader } from "@/components/global/header/subHeader";
import { PageTitleProvider } from "@/lib/context/pageTitle";

export default async function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <PageTitleProvider>
      <div className="pb-5">
        <Header />
        <SubHeader />
        <div className="container px-2 md:px-4 lg:px-5 py-4 rounded-md m-auto bg-white min-h-[80vh]">
          {children}
        </div>
      </div>
    </PageTitleProvider>
  )
}