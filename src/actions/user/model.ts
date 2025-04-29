import { z } from "zod"
import { UserType } from '@prisma/client'

export type usersType = {
  id: string,
  name: string,
  email: string,
}

export const userModel = {
  type: z.nativeEnum(UserType).optional(),
  email: z.string().email().optional(),
  name: z.string().optional()
}