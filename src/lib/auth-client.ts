import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, organizationClient } from "better-auth/client/plugins"
import { ac, member, owner, admin, customer, customerOfInternSupplier } from "./permissions";

const URL = process.env.APP_URL

export const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    // baseURL: URL, ON TESTE LE REDEPLOY
    plugins: [ 
      organizationClient({
        ac,
        roles: {
          owner,
          admin,
          member,
          customer,
          customerOfInternSupplier
        },
      }),
      inferAdditionalFields({
        user: {
          type: {
            type: 'string',
            required: true
          }
        }
      })
  ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession
} = authClient;