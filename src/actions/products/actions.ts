"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { productModel } from "./model"
import { Cart, CartModel } from "@/actions/cart/model"
import { getCart } from '@/lib/cart';
import { getSupplier } from '../organization/actions';

export const createProducts = authActionClient
.metadata({ actionName: "createProduct" }) 
.schema(z.object({
  products: z.array(z.object(productModel)),
  createByCustomer: z.boolean().default(false).optional(),
  catalogueId: z.string()
}))
.action(async ({ parsedInput: { products, createByCustomer, catalogueId }, ctx: { user } }) => {
  
  try {
    // Chek if products are validated
    const results = products.map((product) => {
      const result = z.object(productModel).safeParse(product)
      return {
        success: result.success,
        data: result.success ? result.data : product,
        error: result.success ? null : result.error.format(),
      }
    })
    
    const validProducts = results.filter(r => r.success).map(r => r.data)
    const invalidProducts = results.filter(r => !r.success)
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
          catalogueId: products[0].catalogueId
        }
      })
      // Create the subCatalogue
      await prisma.subCatalogue.create({
        data: {
          customerId: user?.user?.id,
          status: "memberInvited",
          catalogueId: products[0].catalogueId,
          products: {
            create: allProducts.map((prod) => ({
              assignedBy: user.user ? user.user.name : "Inconnu",
              price: prod.price,
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
      errors: invalidProducts.map((r, index) => ({
        index,
        product: r.data,
        error: r.error,
      })),
    }
  } catch (error) {
    return { success: false, error };
  }
});


export const getAllProducts = authActionClient
.metadata({ actionName: "createProduct" })
.action(async ({ ctx: { user } }) => {
  
  try {
    // New products
    const subCatalogues = await prisma.subCatalogue.findMany({
      where: {
        customerId: user?.user?.id
      },
      include: {
        catalogue: {
          select: {
            organization: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        products: {
          select: {
            product: {
              select: {
                name: true,
                description: true,
                ref: true,
                id: true
              }
            },
            price: true
          }
        }
      }
    });

    const allProducts =  subCatalogues.flatMap(sub =>
      sub.products.map(product => ({
        ...product,
        supplierName: sub.catalogue.organization.name,
        organizationId: sub.catalogue.organization.id
      }))
    );

    return { success: true, products: allProducts, subCatalogues: subCatalogues };
  } catch (error) {
    return { success: false, error };
  }
});


export const getInCartProducts = authActionClient
.metadata({ actionName: "createProduct" })
.schema(z.object({products: z.array(z.object(CartModel))}))
.action(async ({ parsedInput: { products }, ctx: { user } }) => {
  
  try {
    const productsIds = <string[]>[]
    products.map((p:any) => productsIds.push(p.productId))
  
    const subCatalogues = await prisma.subCatalogue.findMany({
      where: {
        customerId: user?.user?.id,
        products: {
          some: {
            productId: { in: productsIds },
          },
        }
      },
      include: {
        products: {
          where: {
            productId: { in: productsIds },
          },
          select: {
            product: {
              select: {
                name: true,
                ref: true
              }
            },
            productId: true,
            price: true
          }
        }
      }
    });

    let totalPriceHt = 0;
    const allProducts =  subCatalogues.flatMap(sub =>
      sub.products.map(product => {
        const matched = products?.find(p => p.productId === product.productId)
        const priceHt = matched ? matched.quantity * product.price : 0;

        totalPriceHt += priceHt;
    
        return {
          id: product.productId,
          name: product.product.name,
          ref: product.product.ref,
          quantity: matched ? matched.quantity : 0,
          priceHt,
        }
      })
    );

    return { success: true, products: allProducts, totalPriceHt: totalPriceHt };
  } catch (error) {
    return { success: false, error };
  }
});


export const GroupedSupplierAndGetPrice = authActionClient
.metadata({ actionName: "GroupedSupplierAndGetPrice" })
.action(async () => {
    const response = await getCart()

    const grouped: Record<string, { supplierId: string; supplier: any, products: Cart, fullProducts?: any[], totalPriceHt?: number }> = {};

    for (const item of response) {
      if (!grouped[item.supplierId]) {
        const org = await getSupplier({organizationId: item.supplierId})
        grouped[item.supplierId] = {
          supplierId: item.supplierId,
          supplier: org?.data?.organization ? org.data.organization : {},
          products: []
        };
      }
      grouped[item.supplierId].products.push(item);
    }

    const groupedArray = await Promise.all(
      Object.values(grouped).map(async (item) => {
        const products = await getInCartProducts({ products: item.products });
        
        return {
          ...item,
          fullProducts: products?.data?.products ? products.data.products : [],
          totalPriceHt: products?.data?.totalPriceHt ? products.data.totalPriceHt : 0,
        };
      })
    );

    return { groupedArray: groupedArray }
  })