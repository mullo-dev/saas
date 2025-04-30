import { GoBackButton } from "@/components/global/buttons/goBackButton";

export default async function LayoutSubPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <GoBackButton className="mb-4" />
      {children}
    </div>
  )
}