import { z } from "zod"

export type catalogueType = {
  name: string
}

export const catalogueModel = {
  name: z.string().min(1, "Name is required"),
  organizationId: z.string()
}

export const subCatalogueModel = {
  customerEmail: z.string().min(1, "User is required"),
  catalogueId: z.string().min(1, "Catalogue is required")
}

export const selectProductModel = {
  price: z.number(),
  productId: z.string().min(1, "Product is required")
}