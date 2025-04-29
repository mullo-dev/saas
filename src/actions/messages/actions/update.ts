"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const readMessage = authActionClient
  .metadata({ actionName: "readMessage" }) 
  .schema(z.object({conversationId: z.string()}))
  .action(async ({ parsedInput: { conversationId }, ctx: { user } }) => {

  try {
    await prisma.message.updateMany({
      where: {
        conversationId,
        NOT: {
          readBy: {
            has: user?.user?.email
          }
        }
      },
      data: {
        readBy: {
          push: user?.user?.email
        }
      }
    });

    return { success: true, message: "Conversation lue" };
  } catch (error) {
    return { success: false, error };
  }
});