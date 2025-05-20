"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { messageModel } from '../model';
import { resend } from '@/lib/resend';
import ReviewEmail from '@/components/emails/reviewEmail'

const URL = process.env.APP_URL

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
        href: `${URL}/compte`
      })
    })

    revalidatePath("/dashboard")
    return { success: true, conversation: conversation };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});