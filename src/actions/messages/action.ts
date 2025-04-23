"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { messageModel } from './model';
import { resend } from '@/lib/resend';

export const createMessage = authActionClient
  .metadata({ actionName: "createMessage" })
  .schema(z.object(messageModel))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {

    if (!user?.user?.email) {
      throw new Error("Email non trouvé")
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        fromEmail_toEmail: {
          toEmail: parsedInput.toEmail,
          fromEmail: user.user.email
        }
      },
      create: {
        toEmail: parsedInput.toEmail,
        fromEmail: user.user.email,
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
    // await resend.emails.send({
    //   from: user.user.email,
    //   to: conversation.toEmail,
    //   subject: "Reset Password",
    //   text: `Reset password here : ${data.url}`,
    // })

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
        OR: [{ toEmail: user?.user?.email }, { fromEmail: user?.user?.email }],
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
  .schema(z.object({email: z.string()}))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        fromEmail_toEmail: { 
          toEmail: parsedInput.email, 
          fromEmail: user?.user?.email as string
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      }
    });

    if (!conversation) return { success: true, conversation: { message: "Aucune conversation à afficher" } }

    const toUser = await prisma.user.findUnique({
      where: { email: conversation.toEmail },
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