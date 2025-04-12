import { z } from "zod";

export type organizationType = {
  name: string,
  phone: string,
  email: string,
  siret: string,
  city: string,
  contactId: string,
  members?: string[]
}

export type memberType = {
  userId: string,
  role: string,
}

export const organizationModel = {
  name: z.string().min(1, "Name is required"),
  phone: z.string(),
  email: z.string(), //.min(1, "Email is required"),
  siret: z.string(), //.min(14, "Siret is required").max(14),
  city: z.string(), //.min(1, "City is required"),
  contactId: z.string(),
}