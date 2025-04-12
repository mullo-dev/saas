"use server"

import { z } from 'zod';
import { organizationModel } from './model';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { MemberRole } from "@prisma/client"
import { toast } from 'sonner';

// const paramsSchema = z.object({
//   id: z.string(),
// });

// const querySchema = z.object({
//   search: z.string().optional(),
// });

// const bodySchema = z.object({
//   field: z.string(),
// });

export const getOrganizationById = authActionClient
  .metadata({ actionName: "createAddress" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId }, ctx: { user } }) => {

  try {
    // New organization
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
             user: {
              select: {
                name: true,
                email: true
              }
             }
          }
        }
      }
    });

    return { success: true, organization: organization };
  } catch (error) {
    return { success: false, error };
  }

});

export const createOrganization = authActionClient
  .metadata({ actionName: "createAddress" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput, ctx: { user } }) => {

  try {
    // New organization
    await prisma.organization.create({
      data: {
        ...parsedInput,
        members: {
          create: [
            {
              assignedBy: user.name,
              role: "ADMIN",
              user: {
                connect: {
                  id: user.id
                }
              }
            }
          ]
        }
      }
    })

    revalidatePath("/dashboard")
    toast.success("Organisation créée")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }

});


export const addMemberToOrganization = authActionClient
  .metadata({ actionName: "createAddress" }) 
  .schema(z.object({
    organizationId: z.string(),
    userId: z.string(),
    role: z.enum(Object.values(MemberRole) as [string, ...string[]])
  }))
  .action(async ({ parsedInput: { userId, organizationId, role }, ctx: { user } }) => {

  try {
    // New organization
    const organization = await prisma.usersOnOrganizations.create({
      data: {
        assignedBy: user.name,
        role: role as MemberRole,
        user: {
          connect: { id: userId },
        },
        organization: {
          connect: { id: organizationId }, // <- passe l'ID de l'organisation ici
        },
      },
    });

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }

});