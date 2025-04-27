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
  products: z.array(z.object(productModel))
}))
.action(async ({ parsedInput: { products } }) => {
  
  try {
    // New products
    await prisma.product.createMany({
      data: products,
    });

    return { success: true };
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


export const GroupedAupplierAndGetPrice = authActionClient
.metadata({ actionName: "groupedAupplierAndGetPrice" })
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