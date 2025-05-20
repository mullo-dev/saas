"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignOutButton(props: {
  className?:string,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.refresh()
      router.push("/auth/sign-in")
    } catch (error) {
      toast.error("Impossible de se déconnecter : une erreur est survenue");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={props.variant}
      onClick={handleSignOut}
      disabled={loading}
      className={props.className}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        "Déconnexion"
      )}
    </Button>
  );
} 