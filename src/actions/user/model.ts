import { z } from "zod"

export enum UserTypeEnum {
  SUPPLIER = "SUPPLIER",
  CUSTOMER = "CUSTOMER",
}

export type usersType = {
  id: string,
  name: string,
  email: string,
}

export const userModel = {
  type: z.nativeEnum(UserTypeEnum).optional(),
  email: z.string().email().optional(),
  name: z.string().optional()
}
