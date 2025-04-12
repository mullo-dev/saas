"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const getUsers = authActionClient
  .metadata({ actionName: "createAddress" }) 
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    // New organization
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return { success: true, users: users };
  } catch (error) {
    return { success: false, error };
  }

});