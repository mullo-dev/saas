"use server"

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/auth-action';
import { CartModel } from "@/actions/cart/model"

export const getAllProducts = authActionClient
.metadata({ actionName: "createProduct" })
.action(async ({ ctx: { user } }) => {
  
  try {
    // New products
    const subCatalogues = await prisma.subCatalogue.findMany({
      where: {
        customerId: user?.user?.id,
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
          where: {
            product: {
              enabled: true
            }
          },
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

    const allProducts =  subCatalogues.flatMap((sub:any) =>
      sub.products.map((product:any) => ({
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
                ref: true,
                tvaValue: true
              }
            },
            productId: true,
            price: true,
          }
        }
      }
    });

    let totalPriceHt = 0, totalTva = 0;
    const allProducts =  subCatalogues.flatMap((sub:any) =>
      sub.products.map((product:any) => {
        const matched = products?.find(p => p.productId === product.productId)
        const priceHt = matched ? matched.quantity * product.price : 0;
        const tva = matched ? ((priceHt * product.product.tvaValue)/100) : 0;

        totalPriceHt += priceHt;
        totalTva += tva
    
        return {
          id: product.productId,
          name: product.product.name,
          ref: product.product.ref,
          quantity: matched ? matched.quantity : 0,
          priceHt,
          tva
        }
      })
    );

    return { success: true, products: allProducts, totalPriceHt: totalPriceHt, totalTva: totalTva };
  } catch (error) {
    return { success: false, error };
  }
});