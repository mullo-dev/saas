"use server"

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { clearCart } from "@/lib/cart";
import { resend } from "@/lib/resend";
import NewOrderEmail from "@/components/emails/newOrder";
import { GroupedSupplierAndGetPrice } from "../../organization/actions/get";
import OrderValidate from "@/components/emails/orderValidate";
import { sendSms } from "@/lib/send-sms";
import { z } from "zod";

export const createOrder = authActionClient
  .metadata({ actionName: "createOrder" }) 
  .schema(
    z.object({messages: z.array(
      z.object({ 
        supplierId: z.string(), 
        message: z.string() 
      })
    )})
  )
  .action(async ({ parsedInput: { messages }, ctx: { user } }) => {

  try {
    const url = "https://localhost:3000"
    const grouped = await GroupedSupplierAndGetPrice()

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
            deliveryNote: "",
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

    if (user?.user?.email) {
      await resend.emails.send({
        from: 'noreply@mullo.fr',
        to: user.user.email,
        subject: "Commande validée",
        react: OrderValidate({
          href: `${url}/orders/${order.id}`
        })
      })
    }

    order.suppliers.map(async (supplier:any) => {
      const organization = grouped?.data?.groupedArray.find((sup) => sup.supplierId === supplier.supplierId)
      const message = messages.find((m:any) => m.supplierId === supplier.supplierId)?.message
      // const filePath = path.join(process.cwd(), 'public', 'pdf', `order-${order.ref}.pdf`);
      // const stream = fs.createWriteStream(filePath);
      // const pdfStream = await renderToBuffer(<DeliveryNotePDF order={order} supplier={supplier} products={supplier.products} />);
      // pdfStream.pipe(stream);
      // await new Promise((resolve) => stream.on('finish', () => resolve(undefined)));

      // const publicUrl = `/pdf/order-${order.ref}.pdf`

      // await prisma.supplierOnOrder.update({
      //   where: {
      //     id: supplier.id
      //   },
      //   data: {
      //     deliveryNote: publicUrl
      //   }
      // });

      // ADD DELIVERYNOTE IN THE MAIL
      await resend.emails.send({
        from: 'noreply@mullo.fr',
        to: organization?.supplier.metadata.email ? organization?.supplier.metadata.email.trim() : organization?.supplier.members[0].user.email.trim(),
        subject: "Vous avez une nouvelle commande à traîter",
        // replyTo: `reply+${conversation.id}@mullo.fr`,
        react: NewOrderEmail({
          products: organization?.fullProducts,
          client: user?.user?.name,
          href: `${url}/dashboard/orders/${order.id}`,
          message: message
        })
      })

      // if (organization?.supplier.metadata.contactPreference?.includes("sms")) {
        const smsMessage = `Nouvelle commande de ${user?.user?.name}:\n\n${message}\n\nvoir la commande : ${url}/dashboard/orders/${order.id}`;
        await sendSms("+33770079644","+33770079644",smsMessage) // organization?.supplier.metadata.phone
      // }
    })

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
