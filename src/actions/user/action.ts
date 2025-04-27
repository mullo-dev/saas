"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';

export const getUsers = authActionClient
  .metadata({ actionName: "createAddress" }) 
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    // New organization
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return { success: true, users: users };
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
            role: 'customer'
          }
        }
      },
      include: {
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