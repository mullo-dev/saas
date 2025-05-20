"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { productModel } from "../model"

export const createProducts = authActionClient
.metadata({ actionName: "createProduct" }) 
.schema(z.object({
  products: z.any(),
  createByCustomer: z.boolean().default(false).optional(),
  catalogueId: z.string()
}))
.action(async ({ parsedInput: { products, createByCustomer, catalogueId }, ctx: { user } }) => {
  
  try {
    const formattedData = products.map((item:any) => ({
      ref: String(item.chooseRef),
      name: String(item.chooseName),
      description: String(item.chooseDescription),
      price: typeof item.choosePrice === "number" ? item.choosePrice 
      : Number.isNaN(Number(item.choosePrice.replace(',', '.'))) ? 
        0
      : Number(item.choosePrice.replace(',', '.')),
      catalogueId: String(catalogueId),
      unit: String(item.chooseUnit),
      tvaValue: typeof item.chooseTvaValue === "number" ? item.chooseTvaValue 
        : Number.isNaN(Number(item.chooseTvaValue.replace(',', '.'))) ? 
          0
        : Number(item.chooseTvaValue.replace(',', '.')),
      categories: [String(item.chooseCategories)],
      enabled: true,
      sellQuantity: typeof item.chooseSellQuantity === "number" ? item.chooseSellQuantity 
        : Number.isNaN(Number(item.chooseSellQuantity.replace(',', '.'))) ? 
          0
        : Number(item.chooseSellQuantity.replace(',', '.')),
      })
    )

    // Chek if products are validated
    const results = formattedData.map((product: typeof productModel) => {
      const result = z.object(productModel).safeParse(product)
      return {
        success: result.success,
        data: result.success ? result.data : product,
        error: result.success ? null : result.error.format(),
      }
    })
    
    const validProducts = results.filter((r:any) => r.success).map((r:any) => r.data)
    const invalidProducts = results.filter((r:any) => !r.success)
    const created: any[] = []
    const updated: any[] = []

    for (const product of validProducts) {
      const existing = await prisma.product.findFirst({
        where: { 
          name: product.name,
          catalogueId: catalogueId
        },
      });
    
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: product,
        });
        updated.push(existing)
      } else {
        const newProduct = await prisma.product.create({ data: product });
        created.push(newProduct)
      }
    }

    // TO DO : ADD HERE UPDATE AND ADD PRODUCTS (add also the produt is already in)
    if (createByCustomer) {
      const allProducts = await prisma.product.findMany({
        where: {
          catalogueId: catalogueId
        }
      })
      // Create the subCatalogue
      await prisma.subCatalogue.create({
        data: {
          customerId: user?.user?.id,
          status: "memberInvited",
          catalogueId: catalogueId,
          products: {
            create: allProducts.map((prod:any) => ({
              assignedBy: user.user ? user.user.name : "Inconnu",
              price: prod.price ? prod.price : 0,
              product: {
                connect: {
                  id: prod.id
                }
              }
            }))
          }
        }
      })
    }

    return {
      success: true,
      created: created.length,
      updated: updated.length,
      failed: invalidProducts.length,
      errors: invalidProducts.map((r:any, index:number) => ({
        index,
        product: r.data,
        error: r.error,
      })),
    }
  } catch (error) {
    return { success: false, error };
  }
});


export const createSingleProduct = authActionClient
.metadata({ actionName: "createProduct" }) 
.schema(z.object(productModel))
.action(async ({ parsedInput }) => {
  
  try {
    const product = await prisma.product.create({ 
      data: parsedInput 
    });

    return { success: true, product: product };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
});