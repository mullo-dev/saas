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