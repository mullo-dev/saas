"use client";

import { useUser } from "@/lib/auth-session-client";
import { Navigation } from "../nav/nav";
import Image from "next/image";

export function Header() {
  const { user } = useUser();

  return (
    <div className="rounded-md mb-4 bg-secondary-500 py-2 md:py-4 px-6 md:px-8">
      <div className="container flex justify-between items center m-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            width={110}
            height={60}
            alt="Logo de Mullo"
            className="hidden md:block"
          /> 
          <Image
            src="/logo-little.svg"
            width={30}
            height={0}
            alt="Logo de Mullo"
            className="block md:hidden"
          /> 
          <span className="hidden md:block text-lg font-bold text-primary mt-2">- fournisseurs</span>
        </div>
        <Navigation user={user} />
      </div>
    </div>
  );
}