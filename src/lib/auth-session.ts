import { auth } from "@/lib/auth"
import { cookies } from "next/headers"
import { cache } from "react"
 
// Use React's cache to avoid duplicate requests
export const getUser = cache(async () => {
  const cookieStore = cookies();
  const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookieStore.toString()
      })
  })
  return session?.user;
});