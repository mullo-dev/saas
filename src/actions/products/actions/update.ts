"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { productModelUpdate } from '../model';
import { prisma } from '@/lib/prisma';

export const updateProduct = authActionClient
  .metadata({ actionName: "updateProduct" }) 
  .schema(z.object({...productModelUpdate, productId: z.string() }))
  .action(async ({ parsedInput: { productId, ...parsedInput } }) => {

  try {

    const result = await prisma.product.update({
      where: { id: productId },
      data: parsedInput
    })

    return { success: true, product: result };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});