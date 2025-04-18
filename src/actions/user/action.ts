"use server"

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { organizationsSchema } from '../organization/model';


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
  .schema(organizationsSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    // On récupère les memberships de ce user
    const memberships = await prisma.member.findMany({
      where: {
        userId: user.id,
        role: "member",
      },
      select: {
        organizationId: true,
      },
    });

    const memberOrgIds = memberships.map((m) => m.organizationId);

    // On filtre les organizations qui matchent ces IDs
    const filteredOrganizations = parsedInput.filter((org) =>
      memberOrgIds.includes(org.id)
    );

    // We will check if inviations are pending for this user
    let invitedOrganizationsWithFlag = <any>[]
    const invitations = await prisma.invitation.findMany({ 
      where: { email: user.email, status: "pending" }
    })
    if (invitations.length > 0) {
      const invitedOrgIds = invitations.map((inv:any) => inv.organizationId);

      const invitedOrganizations = await prisma.organization.findMany({
        where: { id: { in: invitedOrgIds } },
        select: { 
          id: true, 
          slug: true,
          invitations: { 
            where: { email: user.email },
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