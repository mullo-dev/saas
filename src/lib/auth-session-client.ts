"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useUser() {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    user: mounted ? session?.user : null,
    isPending: mounted ? isPending : true
  };
} 