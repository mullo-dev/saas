import { resend } from './resend';
import { nextCookies } from 'better-auth/next-js';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
      provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
      enabled: true,
      async sendResetPassword(data, request) {
          await resend.emails.send({
            from: "noreply@mullo.fr",
            to: data.user.email,
            subject: "Reset Password",
            text: `Reset password here : ${data.url}`,
          })
      },
  },
  // socialProviders: {
  //     google: {
  //         clientId: process.env.GOOGLE_CLIENT_ID,
  //         clientSecret: process.env.GOOGLE_CLIENT_SECRET
  //     },
  //     github: {
  //         clientId: process.env.GITHUB_CLIENT_ID,
  //         clientSecret: process.env.GITHUB_CLIENT_SECRET
  //     }
  // },
  plugins: [
    nextCookies()
  ]
});