import { z } from "zod";
import { catalogueType } from "@/actions/catalogue/model";
import { memberTypeFull } from "@/actions/members/model";

export type organizationType = {
  id: string,
  name: string,
  slug: string,
  catalogues?: catalogueType[],
  members?: memberTypeFull[],
  invitations?: any[]
  logo?: string
}

export const organizationModel = {
  name: z.string().min(1, "Name is required"),
  slug: z.string(),
  createByCustomer: z.boolean().default(false),
  metadata: z.object({
    email: z.string(),
    supplierName: z.string(),
    phone: z.string()
  }).optional()
}

export const organizationsSchema = z.array(
  z.object({
    id: z.string(),
    slug: z.string(),
    invit: z.boolean().optional().default(false)
  })
)

export type supplierType = {
  name: string,
  slug: string,
  logo?: string,
  email: string,
  supplierName: string,
  phone: string
}