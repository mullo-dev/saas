"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { addressModel } from '../model';

export const createAddress = authActionClient
  .metadata({ actionName: "createAddress" })
  .schema(z.object(addressModel))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    if (!user?.activeOrganizationId) {
      throw new Error("You don't have an organization")
    }

    const address = await prisma.address.create({
      data: {
        organizationId: user.activeOrganizationId,
        ...parsedInput,
      }
    })

    revalidatePath("/dashboard")
    return { success: true, address: address };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});