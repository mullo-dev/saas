import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export const passActiveOrganization = authActionClient
  .metadata({ actionName: "activeOrganization" }) 
  .schema(z.object({organizationId: z.string().optional()}))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    const cookieStore = await cookies();
    let orgaId

    if (!parsedInput.organizationId && user?.user) {
      const ownOrg = await auth.api.listOrganizations({
        headers: new Headers({
          cookie: cookieStore.toString()
        })
      })
      orgaId = ownOrg[0]?.id
    } else {
      orgaId = parsedInput.organizationId
    }

    if (!orgaId) {
      throw new Error("Organization not found")
    }

    const organization = await auth.api.setActiveOrganization({
      body: {
        organizationId: orgaId,
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    })
    
    return { success: true, organization: organization };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});