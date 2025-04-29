"use server"

import { prisma } from "@/lib/prisma"

  // Check if user already exist
  export async function checkEmail(email: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return true
    } else {
      return false
    }
  }