"use client";

import { useUser } from "@/lib/auth-session-client";
import { useEffect, useState } from "react";
import { Navigation } from "../nav/nav";
import Image from "next/image";

export function Header() {
  const { user, isPending } = useUser();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // // if (!mounted) {
  // //   return (
  // //     <div className="bg-green-200 py-4 px-10">
  // //       <div className="container flex justify-between items center m-auto">
  // //         <div>Mullo</div>
  // //         <div>Loading...</div>
  // //       </div>
  // //     </div>
  // //   );
  // // }

  return (
    <div className="container m-auto rounded-md mt-4 bg-secondary-500 py-4 px-8">
      <div className="container flex justify-between items center m-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            width={115}
            height={60}
            alt="Logo de Mullo"
          /> 
          <span className="text-lg font-bold text-primary mt-2">- fournisseurs</span>
        </div>
        {isPending ?
          <div>Loading...</div>
        :
          <Navigation user={user} />
        }
      </div>
    </div>
  );
}
        {/* user ? (
          <>
            <span>{user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <Link className={buttonVariants({ variant: "outline" })} href="/auth/sign-in">
            Sign In
          </Link>
        )} */}