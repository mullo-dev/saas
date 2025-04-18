"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateSubCatalogueFromInivtation } from '../catalogue/actions';

export const inviteMember = authActionClient
  .metadata({ actionName: "inviteMember" }) 
  .schema(z.object({
    organizationId: z.string(),
    email: z.string(),
    role: z.enum(["member", "admin", "owner"])
  }))
  .action(async ({ parsedInput: { organizationId, email, role } }) => {

  try {
    // New organization
    const cookieStore = await cookies();

    const invitation = await auth.api.createInvitation({
      body: {
        organizationId: organizationId,
        email: email,
        role: role,
        resend: true,
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    });

    revalidatePath("/dashboard")
    return { success: true, invitation: invitation };
  } catch (error) {
    return { success: false, error };
  }
});


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
        checkSubCatalogue.map(async (cat) => (
          await updateSubCatalogueFromInivtation({subCatalogueId: cat.id})
        ))
      }
  
      revalidatePath("/dashboard")
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });


  // USEFUL ?
  export async function getInvitation(invitationId: string) {
    try {
      // New organization
      const cookieStore = await cookies();

      const invitation = await auth.api.getInvitation({
        query: {
            id: invitationId
        },
        headers: new Headers({
          cookie: cookieStore.toString()
        })
      })
  
      revalidatePath("/dashboard")
      return { success: true, invitation: invitation };
    } catch (error) {
      return { success: false, error };
    }
  };


  //remove member
  export const removeMember = authActionClient
  .metadata({ actionName: "acceptInvitation" }) 
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


  // Check if user already exist
  export async function checkEmail(email: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return true
    } else {
      return false
    }
  }