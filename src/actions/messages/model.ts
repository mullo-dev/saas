import { z } from "zod";

export const messageModel = {
  toEmail: z.string(),
  message: z.string()
}