"use server"

import { z } from 'zod';
import { organizationModel } from './model';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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


export const getOrganizationInvited = authActionClient
  .metadata({ actionName: "getOrganizationInvited" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput: { organizationId } }) => {

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    })
    return { success: true, organization: organization };
  } catch (error) {
    return { success: false, error };
  }
});


export const createOrganization = authActionClient
  .metadata({ actionName: "createOrganization" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput }) => {

  try {
    // Check slug and change it if already taken
    const slugTaken = await authClient.organization.checkSlug({
      slug: parsedInput.slug,
    });
    if (!slugTaken) parsedInput.slug = parsedInput.slug + "-" + parsedInput.name.toLowerCase().trim()

    const cookieStore = await cookies();

    // Create organization
    const org = await auth.api.createOrganization({
      body: {
        name: parsedInput.name,
        slug: parsedInput.slug,
        logo: "",
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    });

    // Set the new organization active
    if (org?.id) {
      await auth.api.setActiveOrganization({
        body: {
          organizationId: org.id,
        },
        headers: new Headers({
          cookie: cookieStore.toString()
        })
      })
    }

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});


export const activeOrganization = authActionClient
  .metadata({ actionName: "activeOrganization" }) 
  .schema(z.object({organizationId: z.string()}))
  .action(async ({ parsedInput }) => {

  try {
    const cookieStore = await cookies();

    await auth.api.setActiveOrganization({
      body: {
        organizationId: parsedInput.organizationId,
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    })

    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});
