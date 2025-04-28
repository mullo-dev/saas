"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { messageModel } from './model';
import { resend } from '@/lib/resend';
import ReviewEmail from '@/components/emails/reviewEmail'

export const createMessage = authActionClient
  .metadata({ actionName: "createMessage" })
  .schema(z.object(messageModel))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {

    if (!user?.user?.email) {
      throw new Error("Email non trouvé")
    }

    const userType = await prisma.user.findUnique({where: {id: user.user.id}})

    const conversation = await prisma.conversation.upsert({
      where: {
        customerId_supplierId: {
          customerId: userType?.type === "CUSTOMER" ? userType.id : parsedInput.receiptId,
          supplierId: userType?.type === "SUPPLIER" ? userType.id : parsedInput.receiptId
        }
      },
      create: {
        customerId: userType?.type === "CUSTOMER" ? userType.id : parsedInput.receiptId,
        supplierId: userType?.type === "SUPPLIER" ? userType.id : parsedInput.receiptId,
        messages: {
          create: {
            body: parsedInput.message,
            senderEmail: user.user.email,
            readBy: [user.user.email], // Already read by the author
          }
        }
      },
      update: {
        messages: {
          create: {
            body: parsedInput.message,
            senderEmail: user.user.email,
            readBy: [user.user.email], // Already read by the author
          }
        }
      }
    });

    // SEND EMAIL HERE
    await resend.emails.send({
      from: 'reply@mullo.fr',
      to: parsedInput.toEmail,
      subject: "Vous avez reçu un nouveau message sur Mullo",
      replyTo: `reply+${conversation.id}@mullo.fr`,
      react: ReviewEmail({
        authorName: user.user.name,
        authorEmail: user.user.email,
        reviewText: parsedInput.message,
        href: "http://localhost:3000/compte"
      })
    })

    revalidatePath("/dashboard")
    return { success: true, conversation: conversation };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});


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