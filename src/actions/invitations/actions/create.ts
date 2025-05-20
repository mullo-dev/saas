"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { resend } from '@/lib/resend';

const URL = process.env.APP_URL

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

    const path = `${URL}/auth/accept-request?organization=${organizationId}&customer=${user?.user?.id}&owner=${supplierId}`

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