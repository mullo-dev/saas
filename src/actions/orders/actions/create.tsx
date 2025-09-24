"use server"

import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { clearCart } from "@/lib/cart";
import { resend } from "@/lib/resend";
import NewOrderEmail from "@/components/emails/newOrder";
import { GroupedSupplierAndGetPrice } from "../../organization/actions/get";
import OrderValidate from "@/components/emails/orderValidate";
import { sendSms } from "@/lib/send-sms";
import { z } from "zod";

const URL = process.env.APP_URL
const DeliveryTypeEnum = ["PICKUP", "DELIVERY"] as const;

export const createOrder = authActionClient
  .metadata({ actionName: "createOrder" }) 
  .schema(
    z.object({messages: z.array(
      z.object({
        supplierId: z.string(), 
        message: z.string(),
        deliveryType: z.enum(DeliveryTypeEnum),
        addressChoose: z.string(),
      })
    )})
  )
  .action(async ({ parsedInput: { messages }, ctx: { user } }) => {

  try {
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
            deliveryNote: messages.find((m:any) => m.supplierId === supplier.supplierId)?.message,
            deliveryType: messages.find((m:any) => m.supplierId === supplier.supplierId)?.deliveryType,
            address: messages.find((m:any) => m.supplierId === supplier.supplierId)?.addressChoose,
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
          href: `${URL}/orders/${order.id}`
        })
      })
    }

    let userName = user.user.name
    // if (user.activeOrganizationId) {
    //   const organization = await prisma.organization.findFirst({
    //     where: { id: user.activeOrganizationId }
    //   })
    //   userName = organization?.name
    //   console.log(organization)
    // } else {
    //   userName = user.user.name
    // }

    console.log(userName)

    sendEmailOrderToPreapre(order, messages, grouped, userName)

    // order.suppliers.map(async (supplier:any) => {
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

      // if (organization?.supplier.metadata.contactPreference?.includes("sms")) {
      //   const smsMessage = `Nouvelle commande de ${user?.user?.name}:\n\n${message}\n\nvoir la commande : ${URL}/dashboard/orders/${order.id}`;
      //   await sendSms("+33770079644",organization.supplier.metadata.phone,smsMessage) // organization?.supplier.metadata.phone
      // }
    // })
    
    await clearCart()
    return { success: true, order: order };
  } catch (error) {
    return { success: false, error };
  }
});


export async function sendEmailOrderToPreapre(order:any,messages:any,grouped:any,userName:any) {
  order.suppliers.forEach((supplier:any) => {
    setTimeout(async () => {
      const organization = grouped?.data?.groupedArray.find((sup:any) => sup.supplierId === supplier.supplierId)
      const message = messages.find((m:any) => m.supplierId === supplier.supplierId)?.message
      
      let email: string
      try {
        const parsed = JSON.parse(organization?.supplier.metadata ?? '{}');
        email = parsed.email ?? organization?.supplier.members[0].user.email ?? "contact@mullo.fr";
    
        // ADD DELIVERYNOTE IN THE MAIL
        await resend.emails.send({
          from: 'noreply@mullo.fr',
          to: email.trim(),
          subject: "Vous avez une nouvelle commande à traîter",
          // replyTo: `reply+${conversation.id}@mullo.fr`,
          react: NewOrderEmail({
            products: organization?.fullProducts,
            client: userName,
            href: `${URL}/dashboard/orders/${order.id}`,
            message: message,
            deliveryMethod: supplier.deliveryType === "DELIVERY" ? "A livrer" : userName + " vient récupérer la commande",
            address: supplier.address
          })
        })
      } catch (e) {
        console.error('Supplier email invalide', e);
      }
    }, 2000); // Send email every
  });
}


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
