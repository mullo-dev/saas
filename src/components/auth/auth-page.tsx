"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/auth-session-client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { user, isPending } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
    </div>
  );
} 