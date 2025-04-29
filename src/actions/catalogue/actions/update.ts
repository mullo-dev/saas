"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';

// TO DO : update sub catalogue + update catalogue ?

export const updateSubCatalogueFromInvitation = authActionClient
  .metadata({ actionName: "updateSubCatalogueFromInvitation" })
  .schema(z.object({subCatalogueId: z.string()}))
  .action(async ({ parsedInput: { subCatalogueId }, ctx: { user } }) => {

  try {
    
    await prisma.subCatalogue.update({
      where: { id: subCatalogueId },
      data: {
        customerId: user?.user?.id,
      }
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});