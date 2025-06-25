"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { prisma } from '@/lib/prisma';

export const updateMemberOrganization = authActionClient
  .metadata({ actionName: "updateMemberCustomer" }) 
  .schema(z.object({contactPreference: z.array(z.string()), contactMessage: z.string(), memberId: z.string() }))
  .action(async ({ parsedInput: { memberId, contactMessage, contactPreference } }) => {

  try {

    const result = await prisma.member.update({
      where: { id: memberId },
      data: {
        contactPreference: contactPreference,
        contactMessage: contactMessage
      }
    })

    return { success: true, member: result };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});