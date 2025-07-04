"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { updateAddressModel } from '../model';

export const updateAddress = authActionClient
  .metadata({ actionName: "updateAddress" })
  .schema(z.object(updateAddressModel))
  .action(async ({ parsedInput: { id, organizationId, country, ...parsedInput }, ctx: { user } }) => {

  try {
    if (organizationId !== user?.activeOrganizationId) {
      throw new Error("You don't have autorization")
    }

    await prisma.address.update({
      where: { id: id },
      data: {
        organizationId: organizationId,
        ...parsedInput,
      }
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});