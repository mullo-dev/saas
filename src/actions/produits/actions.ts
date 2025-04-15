"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { productModel } from "./model"

export const createProducts = authActionClient
  .metadata({ actionName: "createProduct" }) 
  .schema(z.array(z.object(productModel)))
  .action(async ({ parsedInput }) => {

  try {
    // New products
    await prisma.product.createMany({
      data: parsedInput,
    });

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});