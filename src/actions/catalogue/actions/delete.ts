"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const deleteCatalogue = authActionClient
  .metadata({ actionName: "deleteCatalogue" })
  .schema(z.object({catalogueId: z.string(), organizationId: z.string()}))
  .action(async ({ parsedInput: { catalogueId, organizationId }, ctx: { user } }) => {

  try {
    if (organizationId !== user?.activeOrganizationId) {
      throw new Error("You don't have autorization")
    }

    await prisma.catalogue.delete({
      where: {
        id: catalogueId,
      },
    })

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});