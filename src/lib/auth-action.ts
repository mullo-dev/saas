import {
  createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";
import { getUser } from "./auth-session";
import { unauthorized } from "next/navigation";

class ActionError extends Error {}

// Base client.
const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) {
      return e.message;
    }

    return e.message;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  // Define logging middleware.
}).use(async ({ next }) => {
  const result = await next();
  return result;
});

export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const user = await getUser()

    if (!user.user) {
      throw new Error("Session not found!");
    }

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { user } });
  });