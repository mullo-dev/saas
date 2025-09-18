"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const deleteOrganization = authActionClient
.metadata({ actionName: "deleteOrganization" }) 
.schema(z.object({organizationId: z.string()}))
.action(async ({ parsedInput: { organizationId }, ctx: { user } }) => {

  try {
    const orga = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        members: true
      },
    })

    if (orga?.members.find((m) => m.userId === user.user?.id )?.role === "customerOfInternSupplier") {
      await prisma.organization.delete({
        where: {
          id: organizationId
        }
      })
    } else {
      throw new Error("Vous n'avez pas les autorisations pour supprimer l'organisation")
    }

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});