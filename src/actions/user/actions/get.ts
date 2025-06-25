"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { z } from 'zod';
import { UserTypeEnum } from '../model';

export const getUsers = authActionClient
  .metadata({ actionName: "getUsers" })
  .schema(z.object({searchType: z.nativeEnum(UserTypeEnum).optional()}))
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
  .action(async ({ parsedInput }) => {

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


export const returnOnlySuppliers = authActionClient
  .metadata({ actionName: "inviteNewUser" }) 
  .action(async ({ ctx: { user } }) => {

  try {
    if (!user?.user) {
      throw new Error("Session not found")
    }
      
    // We get organization customers
    const filteredOrganizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: user.user.id,
            role: { in: ["customer", "customerOfInternSupplier"] }
          }
        }
      },
      include: {
        catalogues: {
          where: {
            subCatalogues: {
              some: {
                customerId: user.user.id,
              },
            },
          },
          select: {
            id: true,
            subCatalogues: {
              where: {
                customerId: user.user.id
              },
              include: {
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
          },
        },
        members: {
          where: {
            role: { in: ["customer", "customerOfInternSupplier"] }
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

      invitedOrganizationsWithFlag = invitedOrganizations.map((org:any) => ({
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