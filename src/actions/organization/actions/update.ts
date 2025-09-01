"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { organizationModel } from '../model';
import { prisma } from '@/lib/prisma';

export const updateOrganization = authActionClient
  .metadata({ actionName: "updateOrganization" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput: { organizationId, ...parsedInput } }) => {

  try {
    const cookieStore = await cookies();

    const org = await auth.api.updateOrganization({
      body: {
        organizationId: organizationId || "",
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


export const simpleUpdateOrganization = authActionClient
  .metadata({ actionName: "simpleUpdateOrganization" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput: { organizationId, name, slug, ...parsedInput } }) => {

    try {
      const result = await prisma.organization.update({
        where: { id: organizationId },
        data: {
          name: name,
          metadata: JSON.stringify({
            email: parsedInput.metadata?.email,
            supplierName: parsedInput.metadata?.supplierName,
            phone: parsedInput.metadata?.phone,
            contactPreference: parsedInput.metadata?.contactPreference,
            contactMessage: parsedInput.metadata?.contactMessage
          })
        }
      })
      return { success: true, organization: result };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }

  });