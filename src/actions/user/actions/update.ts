"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { z } from 'zod';
import { userModel } from '../model';

export const updateUser = authActionClient
  .metadata({ actionName: "updateUser" })
  .schema(z.object(userModel))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { type, name, email } = parsedInput

  try {
    await prisma.user.update({
      where: {
        id: user?.user?.id,
      },
      data: {
        ...(type !== undefined && { type }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      }
    })

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});