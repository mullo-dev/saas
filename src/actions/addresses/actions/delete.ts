"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const deleteAddress = authActionClient
  .metadata({ actionName: "deleteCatalogue" })
  .schema(z.object({addressId: z.string(), organizationId: z.string()}))
  .action(async ({ parsedInput: { addressId, organizationId }, ctx: { user } }) => {

  try {
    if (organizationId !== user?.activeOrganizationId) {
      throw new Error("You don't have autorization")
    }

    await prisma.address.delete({
      where: {
        id: addressId,
      },
    })

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});