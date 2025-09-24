"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Cart } from "@/actions/cart/model"
import { getCart } from '@/lib/cart';
import { getInCartProducts } from '../../products/actions/get';

export const getOrganizationById = authActionClient
  .metadata({ actionName: "getOrganizationById" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId } }) => {

  try {
    const cookieStore = await cookies();
    // Get the organization
    const organization = await auth.api.getFullOrganization({
      headers: new Headers({
        cookie: cookieStore.toString()
      }),
      query: {
        organizationId: organizationId
      }
    })
    return { success: true, organization: organization };
  } catch (error) {
    return { success: false, error };
  }
});


export const getSupplier = authActionClient
  .metadata({ actionName: "getOrganizationInvited" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId } }) => {

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        name: true,
        metadata: true,
        members: {
          where: { role: "owner" },
          select: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
    })
    return { success: true, organization: organization };
  } catch (error) {
    return { success: false, error };
  }
});


export const GroupedSupplierAndGetPrice = authActionClient
.metadata({ actionName: "GroupedSupplierAndGetPrice" })
.action(async () => {
    const response = await getCart()

    const grouped: Record<string, { supplierId: string; supplier: any, products: Cart, fullProducts?: any[], totalPriceHt?: number, totalTva?: number }> = {};

    for (const item of response) {
      if (!grouped[item.supplierId]) {
        const org = await getSupplier({organizationId: item.supplierId})
        grouped[item.supplierId] = {
          supplierId: item.supplierId,
          supplier: org?.data?.organization ? org.data.organization : {},
          products: []
        };
      }
      grouped[item.supplierId].products.push(item);
    }

    const groupedArray = await Promise.all(
      Object.values(grouped).map(async (item) => {
        const products = await getInCartProducts({ products: item.products });
        
        return {
          ...item,
          fullProducts: products?.data?.products ? products.data.products : [],
          totalPriceHt: products?.data?.totalPriceHt ? products.data.totalPriceHt : 0,
          totalTva: products?.data?.totalTva ? products.data.totalTva : 0,
        };
      })
    );

    return { success: true, groupedArray: groupedArray }
  })