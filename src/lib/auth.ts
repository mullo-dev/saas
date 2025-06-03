import { resend } from './resend';
import { nextCookies } from 'better-auth/next-js';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from './prisma';
import { organization } from "better-auth/plugins"
import { ac, admin, customer, member, owner, customerOfInternSupplier } from './permissions';
import InvitationEmail from "@/components/emails/invitation";

const URL = process.env.APP_URL

export const auth = betterAuth({
  user: {
    additionalFields: {
      type: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
        input: true, // don't allow user to set role
      },
    },
  },
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
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
        customer,
        customerOfInternSupplier
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${URL}/auth/accept-invitation/${data.id}?email=${data.email}&type=${data.role}`
          await resend.emails.send({
            from: "noreply@mullo.fr",
            to: data.email,
            subject: data.inviter.user.name + " vous invite à rejoindre " + data.organization.name,
            text: `Accept invite here : ${inviteLink}`,
            react: InvitationEmail({
              owner: data.inviter.user.name,
              organization: data.organization.name,
              href: inviteLink
            })
          })
        },
    }),
    nextCookies()
  ]
});