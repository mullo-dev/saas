import { z } from "zod"

export type addressType = {
  id: string
  organizationId: string
  address: string
  city: string
  zipCode: string
  country: string
  createdAt: Date;
  updatedAt: Date;
  latitude: number | null;
  longitude: number | null;
}

export const addressModel = {
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required")
}

export const updateAddressModel = {
  ...addressModel,
  id: z.string().min(1, "Address ID is required"),
  organizationId: z.string().min(1, "Organization ID is required")
}