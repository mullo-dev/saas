"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@/lib/auth-session-client";
import Link from "next/link";
import SignOutButton from "./signOutButton";

export function Header() {
  const { user, isPending } = useUser();

  return (
    <div className="bg-amber-300 flex py-4 px-10 items-center justify-between">
      <div>Work Travel</div>
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
  );
}