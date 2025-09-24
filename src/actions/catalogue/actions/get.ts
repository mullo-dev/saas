"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const getCatalogueById = authActionClient
  .metadata({ actionName: "getCatalogue" }) 
  .schema(z.object({catalogueId: z.string()}))
  .action(async ({ parsedInput: { catalogueId }}) => {

  try {
    // Get the catalogue
    const catalogue = await prisma.catalogue.findUnique({
      where: { id: catalogueId },
      include: {
        subCatalogues: {
          // select: {}
          include: {
            customer: true,
            products: {
              select: {
                productId: true,
                price: true
              }
            }
          }
        },
        products: true
      }
    });

    return { success: true, catalogue: catalogue };
  } catch (error) {
    return { success: false, error };
  }
});


export const getOrganizationCatalogues = authActionClient
  .metadata({ actionName: "getCatalogueOfOrganizations" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId }}) => {

  try {
    // Get the catalogue
    const catalogues = await prisma.catalogue.findMany({
      where: { organizationId: organizationId },
      include: {
        _count: {
          select: {
            subCatalogues: true,
            products: true,
          },
        },
      },
    });

    return { success: true, catalogues: catalogues };
  } catch (error) {
    return { success: false, error };
  }
});


export const checkCatalogueOrCreate = authActionClient
  .metadata({ actionName: "checkCatalogueOrCreate" }) 
  .schema(z.object({catalogueId: z.string(), userId: z.string()}))
  .action(async ({ parsedInput: { userId, catalogueId }}) => {

  try {
    let subCatalogueToReturn

    const subCatalogue = await prisma.subCatalogue.findFirst({
      where: {
        customerId: userId,
        catalogueId: catalogueId,
      },
    });

    if (!subCatalogue) {
      // New subCatalogue
      const result = await prisma.subCatalogue.create({
        data: {
          customerId: userId,
          status: "memberInvited",
          catalogueId: catalogueId,
        }
      })
      subCatalogueToReturn = result
    } else {
      subCatalogueToReturn = subCatalogue
    }

    return { success: true, subCatalogue: subCatalogueToReturn };
  } catch (error) {
    return { success: false, error };
  }
});