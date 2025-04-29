 "use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';

export const removeMember = authActionClient
.metadata({ actionName: "removeMember" }) 
.schema(z.object({memberId: z.string(), organizationId: z.string()}))
.action(async ({ parsedInput: { memberId, organizationId } }) => {

  try {
    // New organization
    const cookieStore = await cookies();

    await auth.api.removeMember({
      body: {
        memberIdOrEmail: memberId, // this can also be the email of the member
        organizationId: organizationId, // optional, by default it will use the active organization
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});