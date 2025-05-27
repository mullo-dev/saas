"use server"

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const getUsersOrders = authActionClient
.metadata({ actionName: "getUsersOrders" })
.action(async ({ ctx: { user }}) => {

  try {
    const orders = await prisma.order.findMany({ 
      where: {customerId: user?.user?.id },
      include: {
        suppliers: {
          select: {
            totalHt: true
          }
        }
      }
    })
    return { success: true, orders: orders };
  } catch (error) {
    return { success: false, error };
  }
});


export const getOrderBySupplier = authActionClient
  .metadata({ actionName: "getOrderBySupplier" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId }}) => {

  try {
    // Get the catalogue
    const orders = await prisma.order.findMany({
      where: { 
        suppliers: {
          some: {
            supplierId: organizationId,
          },
        },
       },
      include: {
        suppliers: {
          where: { supplierId: organizationId },
          include: {
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

    return { success: true, orders: orders };
  } catch (error) {
    return { success: false, error };
  }
});

export const getOrderById = authActionClient
  .metadata({ actionName: "getOrderById" }) 
  .schema(z.object({orderId: z.string(), organizationId: z.string().optional()}))
  .action(async ({ parsedInput: { orderId, organizationId }}) => {

  try {
    // Get the catalogue
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        suppliers: {
          where: {
            ...(organizationId && {
              supplierId: organizationId
            })
          },
          include: {
            ...(!organizationId && {
              supplier: {
                select: {
                  name: true,
                  members: {
                    where: { role: 'owner' },
                    select: {
                      user: true
                    }
                  }
                }
              },
            }),
            products: {
              select: {
                price: true,
                quantity: true,
                product: true
              }
            }
          }
        },
        customer: true
      }
    });

    return { success: true, order: order };
  } catch (error) {
    console.log(error)
    return { success: false, error };
  }
});