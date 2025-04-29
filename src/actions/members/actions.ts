"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateSubCatalogueFromInvitation } from '../catalogue/actions';
import { resend } from '@/lib/resend';

export const inviteMember = authActionClient
  .metadata({ actionName: "inviteMember" }) 
  .schema(z.object({
    organizationId: z.string(),
    email: z.string(),
    role: z.enum(["member", "admin", "owner", "customer"])
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


// For owner of organization to accept a customer request to join
export const acceptRequestMember = authActionClient
  .metadata({ actionName: "inviteMember" }) 
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


// When a customer ask to a supplier to join
export const sendRequestMember = authActionClient
  .metadata({ actionName: "inviteMember" }) 
  .schema(z.object({
    organizationId: z.string(),
    supplierEmail: z.string(),
    supplierId: z.string()
  }))
  .action(async ({ parsedInput: { organizationId, supplierId, supplierEmail }, ctx: { user } }) => {

  try {

    const path = `http://localhost:3000/auth/accept-request?organization=${organizationId}&customer=${user?.user?.id}&owner=${supplierId}`

    await resend.emails.send({
      from: 'noreply@mullo.fr',
      to: supplierEmail,
      subject: "Vous avez reçu une demande de nouveau client",
      text: `Accept invite here : ${path}`,
    })

    return { success: true };
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
          await updateSubCatalogueFromInvitation({subCatalogueId: cat.id})
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