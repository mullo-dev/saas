"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const getAddressById = authActionClient
  .metadata({ actionName: "getAddressById" }) 
  .schema(z.object({addressId: z.string()}))
  .action(async ({ parsedInput: { addressId }}) => {

  try {
    // Get the address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    return { success: true, address: address };
  } catch (error) {
    return { success: false, error };
  }
});


export const getAddresses = authActionClient
  .metadata({ actionName: "getAddresses" })
  .action(async ({ctx: { user }}) => {

  try {
    if (!user?.activeOrganizationId) {
      throw new Error("You don't have organization")
    }
    // Get the addresses of the organization
    const addresses = await prisma.address.findMany({
      where: { organizationId: user.activeOrganizationId },
    });

    return { success: true, addresses: addresses };
  } catch (error) {
    return { success: false, error };
  }
});