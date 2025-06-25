import { z } from "zod";

export const messageModel = {
  receiptId: z.string(),
  toEmail: z.string(),
  message: z.string(),
  number: z.string().optional()
}