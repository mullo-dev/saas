"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { readMessage } from './update';

export const getConversations = authActionClient
  .metadata({ actionName: "getConversations" }) 
  .action(async ({ ctx: { user } }) => {

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ customerId: user?.user?.id }, { supplierId: user?.user?.id }],
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1 // juste le dernier message
        }
      }
    });

    return { success: true, conversations: conversations };
  } catch (error) {
    return { success: false, error };
  }
});


export const getConversationById = authActionClient
  .metadata({ actionName: "getConversationById" }) 
  .schema(z.object({receiptId: z.string()}))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    const userType = await prisma.user.findUnique({where: {id: user?.user?.id}})

    const conversation = await prisma.conversation.findUnique({
      where: {
        customerId_supplierId: {
          customerId: userType?.type === "CUSTOMER" ? userType.id : parsedInput.receiptId,
          supplierId: userType?.type === "SUPPLIER" ? userType.id : parsedInput.receiptId
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      }
    });

    if (!conversation) return { success: true, conversation: { message: "Aucune conversation à afficher" } }

    if (user?.user?.email && !conversation.messages.at(-1)?.readBy.includes(user.user.email)) {
      await readMessage({conversationId: conversation.id})
    }

    const toUser = await prisma.user.findUnique({
      where: { id: parsedInput.receiptId },
      select: {
        name: true,
        email: true
      }
    })

    return { success: true, conversation: { conversation: conversation, toUser: toUser } };
  } catch (error) {
    return { success: false, error };
  }
});
