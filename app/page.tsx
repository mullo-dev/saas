import { Header } from "@/components/global/header/header";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto mt-5">
        <h1 className="text-center text-3xl font-bold mb-5">
          Connectez vous à vos clients
        </h1>
        <div className="flex justify-center">
          <Link href="/auth/sign-up" className={buttonVariants()}>Commencer</Link>
        </div>
      </div>
    </div>
  );
}
