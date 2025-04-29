"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { UserType } from '@prisma/client'
import { z } from 'zod';
import { userModel } from './model';

export const getUsers = authActionClient
  .metadata({ actionName: "getUsers" })
  .schema(z.object({searchType: z.nativeEnum(UserType).optional()}))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    // New organization
    const users = await prisma.user.findMany({
      where: {
        type: parsedInput.searchType ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        members: {
          where: {
            role: 'owner'
          },
          select: {
            organizationId: true,
            organization: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return { success: true, users: users };
  } catch (error) {
    return { success: false, error };
  }
});


export const getUserById = authActionClient
  .metadata({ actionName: "getUserById" })
  .schema(z.object({userId: z.string()}))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parsedInput.userId,
      },
      select: {
        name: true,
        email: true,
      }
    })

    return { success: true, user: user };
  } catch (error) {
    return { success: false, error };
  }
});


export const updateUser = authActionClient
  .metadata({ actionName: "updateUser" })
  .schema(z.object(userModel))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { type, name, email } = parsedInput

  try {
    await prisma.user.update({
      where: {
        id: user?.user?.id,
      },
      data: {
        ...(type !== undefined && { type }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      }
    })

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
});


export const returnOnlySuppliers = authActionClient
  .metadata({ actionName: "inviteNewUser" }) 
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    if (!user?.user) throw new Error("Invalid user")
      
    // We get organization customers
    const filteredOrganizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: user.user.id,  // à remplacer par l'ID du user connecté
            role: { in: ["customer", "customerOfInternSupplier"] }
          }
        }
      },
      include: {
        catalogues: {
          where: {
            subCatalogues: {
              some: {            // <- IMPORTANT : `some` pour dire "au moins un subCatalogue"
                customerId: user.user.id,
              },
            },
          },
          select: {
            id: true
          }
        },
        members: {
          where: {
            role: 'customer' // ou 'owner' selon ta définition de l'enum
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // We will check if inviations are pending for this user
    let invitedOrganizationsWithFlag = <any>[]
    const invitations = await prisma.invitation.findMany({ 
      where: { email: user?.user?.email, status: "pending" }
    })
    if (invitations.length > 0) {
      const invitedOrgIds = invitations.map((inv:any) => inv.organizationId);

      const invitedOrganizations = await prisma.organization.findMany({
        where: { id: { in: invitedOrgIds } },
        select: { 
          id: true, 
          slug: true,
          invitations: { 
            where: { email: user?.user?.email },
            select: { id: true } 
          }
        },
      });

      invitedOrganizationsWithFlag = invitedOrganizations.map((org) => ({
        ...org,
        invit: true, // we add the invit flag
      }));
    }

    const combinedOrganizations = [
      ...filteredOrganizations,
      ...invitedOrganizationsWithFlag, // come from invitation
    ];

    return {
      success: true,
      filteredOrganizations: combinedOrganizations,
    };
  } catch (error) {
    return { success: false, error };
  }

});