"use client"
 
import { z } from "zod"
 
const organizationShema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  email: z.string(),
  // name: z.string().min(2).max(50),
  // name: z.string().min(2).max(50),
  // name: z.string().min(2).max(50),
})