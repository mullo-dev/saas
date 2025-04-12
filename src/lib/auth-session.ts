"use server"

import { auth } from "@/lib/auth"
import { cookies } from "next/headers"
import { unauthorized } from "next/navigation";
import { cache } from "react"
 
// Use React's cache to avoid duplicate requests
export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookieStore.toString()
      })
  })
  return session?.user;
});

export const getRequiredSession = cache(async () => {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookieStore.toString()
      })
  })

  if (!session) return unauthorized()
  else return session?.user;
});