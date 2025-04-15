import { z } from "zod"

export type catalogueType = {
  name: string
}

export const catalogueModel = {
  name: z.string().min(1, "Name is required"),
  organizationId: z.string()
}