"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateSubCatalogueFromInvitation } from '@/actions/catalogue/actions/update';

export const acceptInvitation = authActionClient
  .metadata({ actionName: "acceptInvitation" }) 
  .schema(z.object({invitationId: z.string()}))
  .action(async ({ parsedInput: { invitationId } }) => {

    try {
      const cookieStore = await cookies();
  
      await auth.api.acceptInvitation({
        body: {
          invitationId: invitationId,
        },
        headers: new Headers({
          cookie: cookieStore.toString()
        })
      })

      const checkSubCatalogue = await prisma.subCatalogue.findMany({
        where: { invitationId : invitationId }
      })

      if (checkSubCatalogue.length > 0) {
        // Here update SubCatalogue for add userId
        checkSubCatalogue.map(async (cat:any) => (
          await updateSubCatalogueFromInvitation({subCatalogueId: cat.id})
        ))
      }
  
      revalidatePath("/dashboard")
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

// For owner of organization to accept a customer request to join
export const acceptRequestMember = authActionClient
  .metadata({ actionName: "acceptNewMember" }) 
  .schema(z.object({
    organizationId: z.string(),
    customerId: z.string()
  }))
  .action(async ({ parsedInput: { organizationId, customerId } }) => {

  try {
    const cookieStore = await cookies();

    const acceptRequest = await auth.api.addMember({
      body: {
          userId: customerId,
          organizationId: organizationId,
          role: "customer", // We pass the customer role as default
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    })

    revalidatePath("/dashboard")
    return { success: true, invitation: acceptRequest };
  } catch (error) {
    return { success: false, error };
  }
});