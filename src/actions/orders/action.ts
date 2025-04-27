"use server"

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GroupedAupplierAndGetPrice } from "../products/actions";
import { clearCart } from "@/lib/cart";
import { resend } from "@/lib/resend";
import ReviewEmail from "@/components/emails/reviewEmail";
import NewOrderEmail from "@/components/emails/newOrder";

export const createOrder = authActionClient
  .metadata({ actionName: "createOrder" }) 
  .action(async ({ ctx: { user } }) => {

  try {
    const grouped = await GroupedAupplierAndGetPrice()

    if (!grouped?.data) throw new Error("Cart not found")
    if (!user?.user) throw new Error("User not found")

    const groupedSuppliers = new Map<string, {
      supplierId: string;
      totalHt: number;
      totalTtc: number;
      products: { productId: string; quantity: number; price: number }[];
    }>();

    for (const supplier of grouped.data.groupedArray) {
      const { supplierId, fullProducts, totalPriceHt } = supplier;

      if (!groupedSuppliers.has(supplierId)) {
        groupedSuppliers.set(supplierId, {
          supplierId,
          totalHt: totalPriceHt,
          totalTtc: 0,
          products: []
        });
      }

      const currentSupplier = groupedSuppliers.get(supplierId)!;

      // Tu dois boucler ici sur les fullProducts probablement ?
      for (const product of fullProducts ?? []) {
        currentSupplier.products.push({
          productId: product.id,
          quantity: product.quantity,
          price: product.priceHt,
        });
      }
    }

    // We create the ref
    const ref = await generateUniqueOrderRef();

    // We create the order
    const order = await prisma.order.create({
      data: {
        ref,
        customerId: user?.user?.id as string,
        suppliers: {
          create: Array.from(groupedSuppliers.values()).map(supplier => ({
            supplierId: supplier.supplierId,
            totalHt: supplier.totalHt,
            totalTtc: supplier.totalTtc,
            products: {
              create: supplier.products
            }
          }))
        }
      },
      include: {
        suppliers: {
          include: { products: true }
        }
      }
    });

    order.suppliers.map(async (supplier:any) => {
      const organization = grouped?.data?.groupedArray.find((sup) => sup.supplierId === supplier.supplierId)
      await resend.emails.send({
        from: 'noreply@mullo.fr',
        to: organization?.supplier.members[0].user.email,
        subject: "Vous avez une nouvelle commande à traîter",
        // replyTo: `reply+${conversation.id}@mullo.fr`,
        react: NewOrderEmail({
          products: organization?.fullProducts,
          client: user?.user?.name,
          href: `http://localhost:3000/orders/${order.id}`
        })
      })
    })

    // await resend.emails.send({
    //   from: 'noreply@mullo.fr',
    //   to: user.user.email,
    //   subject: "Commande validée",
    //   // replyTo: `reply+${conversation.id}@mullo.fr`,
    //   react: ReviewEmail({ // change template here
    //     authorName: user?.user?.name,
    //     authorEmail: user?.user?.email,
    //     reviewText: "Vos fournisseurs ont reçu les instructions. Votre commande sera traîtée par leur soint dans les meilleurs délais.",
    //     href: "http://localhost:3000/orders/id_de_la_commande" // put id here
    //   })
    // })

    revalidatePath("/dashboard")
    await clearCart()
    return { success: true, order: order };
  } catch (error) {
    return { success: false, error };
  }
});


// REF GENERATION
export async function generateUniqueOrderRef(prefix = 'CM', maxRetries = 5): Promise<string> {
  const today = new Date();
  const datePart = today.toLocaleDateString('fr-FR').split('/').reverse().join(''); // 24042025
  const baseRef = `${prefix}-${datePart}`; // CM-24042025

  let attempt = 0;
  let nextNumber = 1;

  while (attempt < maxRetries) {
    const lastOrder = await prisma.order.findFirst({
      where: {
        ref: {
          startsWith: baseRef,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        ref: true,
      },
    });

    if (lastOrder?.ref) {
      const match = lastOrder.ref.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const padded = String(nextNumber).padStart(5, '0');
    const fullRef = `${baseRef}-${padded}`;

    const exists = await prisma.order.findUnique({ where: { ref: fullRef } });

    if (!exists) {
      return fullRef;
    }

    // Retry
    nextNumber++;
    attempt++;
  }

  throw new Error(`Impossible de générer une référence unique après ${maxRetries} tentatives.`);
}
