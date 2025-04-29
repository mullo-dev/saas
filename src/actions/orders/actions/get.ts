"use server"

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const getOrderById = authActionClient
  .metadata({ actionName: "getOrderById" }) 
  .schema(z.object({orderId: z.string()}))
  .action(async ({ parsedInput: { orderId }}) => {

  try {
    // Get the catalogue
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        suppliers: {
          include: {
            supplier: {
              select: {
                name: true,
              }
            },
            products: {
              select: {
                price: true,
                quantity: true,
                product: true
              }
            }
          }
        }
      }
    });

    return { success: true, order: order };
  } catch (error) {
    return { success: false, error };
  }
});