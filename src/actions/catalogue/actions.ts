"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { catalogueModel } from './model';

export const createCatalogue = authActionClient
  .metadata({ actionName: "createCatalogue" })
  .schema(z.object(catalogueModel))
  .action(async ({ parsedInput }) => {

  try {
    // New organization
    await prisma.catalogue.create({
      data: {
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


export const getCatalogueById = authActionClient
  .metadata({ actionName: "getCatalogue" }) 
  .schema(z.object({catalogueId: z.string()}))
  .action(async ({ parsedInput: { catalogueId }}) => {

  try {
    // Get the catalogue
    const catalogue = await prisma.catalogue.findUnique({
      where: { id: catalogueId },
      include: {
        subCatalogues: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });

    return { success: true, catalogue: catalogue };
  } catch (error) {
    return { success: false, error };
  }
});