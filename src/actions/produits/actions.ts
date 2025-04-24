"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { productModel } from "./model"

export const createProducts = authActionClient
.metadata({ actionName: "createProduct" }) 
.schema(z.object({
  products: z.array(z.object(productModel)), // Tableau d'objets selon productModel
  path: z.string(), // Un objet avec une propriété path de type string
}))
.action(async ({ parsedInput: { products, path } }) => {
  
  try {
    // New products
    await prisma.product.createMany({
      data: products,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});


export const getAllProducts = authActionClient
.metadata({ actionName: "createProduct" })
.action(async ({ ctx: { user } }) => {
  
  try {
    // New products
    const subCatalogues = await prisma.subCatalogue.findMany({
      where: {
        customerId: user?.user?.id
      },
      include: {
        catalogue: {
          select: {
            organization: {
              select: {
                name: true
              }
            }
          }
        },
        products: {
          select: {
            product: {
              select: {
                name: true,
                description: true,
                ref: true,
                id: true
              }
            },
            price: true
          }
        }
      }
    });

    const allProducts =  subCatalogues.flatMap(sub =>
      sub.products.map(product => ({
        ...product,
        supplierName: sub.catalogue.organization.name
      }))
    );

    return { success: true, products: allProducts, subCatalogues: subCatalogues };
  } catch (error) {
    return { success: false, error };
  }
});