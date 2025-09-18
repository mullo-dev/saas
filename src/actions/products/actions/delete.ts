"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const deleteProduct = authActionClient
.metadata({ actionName: "deleteProduct" }) 
.schema(z.object({productId: z.string()}))
.action(async ({ parsedInput: { productId } }) => {

  try {
    await prisma.product.delete({
      where: {
        id: productId
      }
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});