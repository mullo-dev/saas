"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { catalogueModel, selectProductModel, subCatalogueModel } from '../model';
import { getOrganizationById } from '../../organization/actions/get';
import { checkEmail } from '../../members/actions/get';
import { inviteMember } from '../../invitations/actions/create';

export const createCatalogue = authActionClient
  .metadata({ actionName: "createCatalogue" })
  .schema(z.object(catalogueModel))
  .action(async ({ parsedInput }) => {

  try {
    // New organization
    const catalogue = await prisma.catalogue.create({
      data: {
        ...parsedInput,
      }
    })

    revalidatePath("/dashboard")
    return { success: true, catalogue: catalogue };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});


export const createSubCatalogue = authActionClient
  .metadata({ actionName: "createCatalogue" })
  .schema(z.object({
    subCatalogue: z.object(subCatalogueModel), 
    selectProducts: z.array(z.object(selectProductModel)),
    organization: z.any()
  }))
  .action(async ({ parsedInput: { subCatalogue, selectProducts, organization }, ctx: { user } }) => {

  try {
    const fullOrganization = await getOrganizationById(organization.slug)
    // Check if user exist and invited it is not
    let status, userId, invitation
    if (fullOrganization?.data?.organization?.members.find((user:any) => user.user.email === subCatalogue.customerEmail)){
      userId = fullOrganization?.data?.organization?.members.find((user:any) => user.user.email === subCatalogue.customerEmail)?.userId
      status = "memberInvited"
    } else {
      const check = await checkEmail(subCatalogue.customerEmail)
      if (check) {
        const result = await prisma.user.findUnique({
          where: { email: subCatalogue.customerEmail }
        })
        userId = result ? result.id : ""
      } else {
        userId = null
      }

      try {
        invitation = await inviteMember({
          email: subCatalogue.customerEmail,
          organizationId: organization.id,
          role: "customer"
        })
      } catch(error) {
        console.error(error)
        return { success: false, error }
      }
      
      status = "pendingInvit"
    }

    // New subCatalogue
    await prisma.subCatalogue.create({
      data: {
        customerId: userId,
        status: status,
        catalogueId: subCatalogue.catalogueId,
        invitationId: invitation?.data?.invitation?.id,
        products: {
          create: selectProducts.map((prod) => ({
            assignedBy: user.user ? user.user.name : "Inconnu",
            price: prod.price,
            product: {
              connect: {
                id: prod.productId
              }
            }
          }))
        }
      }
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
});