"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { catalogueModel, selectProductModel, subCatalogueModel } from './model';

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
        products: true
      }
    });

    return { success: true, catalogue: catalogue };
  } catch (error) {
    return { success: false, error };
  }
});


export const createSubCatalogue = authActionClient
  .metadata({ actionName: "createCatalogue" })
  .schema(z.object({subCatalogue: z.object(subCatalogueModel), selectProducts: z.array(z.object(selectProductModel))}))
  .action(async ({ parsedInput: { subCatalogue, selectProducts }, ctx: { user } }) => {

  try {
    // Exemple avec une action ou API route
    // const existingUser = await prisma.user.findUnique({
    //   where: { email: subCatalogue.customerEmail }
    // });

    // let userIdToLink;

    // if (existingUser) {
    //   userIdToLink = existingUser.id;
    // } else {
    //   const newUser = await prisma.user.create({
    //     data: {
    //       email: invitedEmail,
    //       status: 'INVITED', // Optionnel, selon ton schéma
    //     }
    //   });

    //   userIdToLink = newUser.id;

    //   // Envoi d'un mail avec un lien pour compléter l'inscription
    //   await sendInvitationEmail(invitedEmail, newUser.id);
    // }

    // New organization
    await prisma.subCatalogue.create({
      data: {
        customerId: "userIdToLink",
        catalogueId: subCatalogue.catalogueId,
        products: {
          create: selectProducts.map((prod) => ({
            assignedBy: user.name,
            price: prod.price,
            product: {
              connect: {
                id: prod.productId
              }
            }
          }))
        }
      }
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});