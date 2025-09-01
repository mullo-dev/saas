"use server"

import { z } from 'zod';
import { authActionClient } from '@/lib/auth-action';
import { revalidatePath } from 'next/cache';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createCatalogue } from '../../catalogue/actions/create';
import { organizationModel } from '../model';

export const createOrganization = authActionClient
  .metadata({ actionName: "createOrganization" }) 
  .schema(z.object(organizationModel))
  .action(async ({ parsedInput }) => {

  try {
    // Check slug and change it if already taken
    const slugTaken = await authClient.organization.checkSlug({
      slug: parsedInput.slug || parsedInput.name.toLowerCase().trim(),
    });
    if (!slugTaken) parsedInput.slug = parsedInput.slug + "-" + parsedInput.name.toLowerCase().trim()

    const cookieStore = await cookies();

    // Create organization
    const org = await auth.api.createOrganization({
      body: {
        name: parsedInput.name,
        slug: parsedInput.slug || parsedInput.name.toLowerCase().trim(),
        logo: "",
        metadata: parsedInput.createByCustomer ? parsedInput.metadata : {}
      },
      headers: new Headers({
        cookie: cookieStore.toString()
      })
    });

    if (org && parsedInput.createByCustomer) {
      await prisma.member.update({
        where: {
          id: org.members[0]?.id
        },
        data: {
          role: "customerOfInternSupplier"
        }
      })
      await createCatalogue({organizationId: org.id, name: org.name + " - catalogue"})
    } else {
      // Set the new organization active to the create user
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
    }


    revalidatePath(parsedInput.createByCustomer ? "/suppliers" : "/dashboard")
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});