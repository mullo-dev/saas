"use client";

import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/lib/auth-session-client";
import Link from "next/link";
import SignOutButton from "../buttons/signOutButton";

export function Header() {
  const { user, isPending } = useUser();

  return (
    <div className="bg-green-200 py-4 px-10">
      <div className="container flex justify-between items center m-auto">
        <div>Mullo</div>
        {isPending ? (
          <div>Loading...</div>
        ) : user ? (
          <>
            <span>{user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <Link className={buttonVariants({ variant: "outline" })} href="/auth/sign-in">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}