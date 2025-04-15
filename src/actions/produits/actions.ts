"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { MemberRole } from "@prisma/client";

export const createProductsWithExcel = authActionClient
  .metadata({ actionName: "addMember" }) 
  .schema(z.object({
    organizationId: z.string(),
    userId: z.string(),
    role: z.enum(Object.values(MemberRole) as [string, ...string[]])
  }))
  .action(async ({ parsedInput: { userId, organizationId, role }, ctx: { user } }) => {

  try {
    // New organization
    await prisma.usersOnOrganizations.create({
      data: {
        assignedBy: user.name,
        role: role as MemberRole,
        user: {
          connect: { id: userId },
        },
        organization: {
          connect: { id: organizationId }, // <- passe l'ID de connexion ici
        },
      },
    });

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});