"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { productModelUpdate } from '../model';
import { prisma } from '@/lib/prisma';

export const updateProduct = authActionClient
  .metadata({ actionName: "updateProduct" }) 
  .schema(z.object({...productModelUpdate, productId: z.string() }))
  .action(async ({ parsedInput: { productId, ...parsedInput }, ctx: { user } }) => {

  try {

    const result = await prisma.product.update({
      where: { id: productId },
      data: parsedInput
    })

    // If price is updated, also update the ProductOnSubCatalogue price
    if (user?.user?.id) {
      const test = await prisma.productOnSubCatalogue.updateMany({
        where: {
          productId: productId
        },
        data: {
          price: parsedInput.price,
        },
      })

      console.log(test)
    }

    return { success: true, product: result };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});