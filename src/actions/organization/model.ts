import { z } from "zod";
import { catalogueType } from "../catalogue/model";
import { memberTypeFull } from "../members/model";

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
  slug: z.string()
}

export const organizationsSchema = z.array(
  z.object({
    id: z.string(),
    slug: z.string(),
    invit: z.boolean().optional().default(false)
  })
)