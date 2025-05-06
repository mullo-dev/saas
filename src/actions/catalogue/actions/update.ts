"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { selectProductModel } from '../model';

// TO DO : update sub catalogue + update catalogue ?
export const addProductsInSubCatalogue = authActionClient
  .metadata({ actionName: "updateSubCatalogueFromInvitation" })
  .schema(z.object({
    subCatalogueId: z.string(),
    selectProducts: z.array(z.object(selectProductModel)),
  }))
  .action(async ({ parsedInput: { subCatalogueId, selectProducts }, ctx: { user } }) => {

  try {
    selectProducts.map(async (prod) =>
      await prisma.productOnSubCatalogue.upsert({
        where: {
          subCatalogueId_productId: {
            subCatalogueId,
            productId: prod.productId,
          },
        },
        update: {
          price: prod.price,
          assignedBy: user.user?.name ?? "Inconnu",
        },
        create: {
          subCatalogueId,
          productId: prod.productId,
          price: prod.price,
          assignedBy: user.user?.name ?? "Inconnu",
        },
      })
    )

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});


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