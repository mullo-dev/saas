"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { organizationModel } from '../model';

export const updateOrganization = authActionClient
  .metadata({ actionName: "updateOrganization" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput }) => {

  try {
    const cookieStore = await cookies();

    const org = await auth.api.updateOrganization({
      body: {
        data: parsedInput
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    });

    return { success: true, organization: org };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});