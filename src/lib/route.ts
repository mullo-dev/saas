import { logger } from "better-auth";
import { createZodRoute } from "next-zod-route"
import { NextResponse } from "next/server";
import { getUser } from "./auth-session";
import { z } from "zod"
import { metadata } from "@app/layout";

export class SafeRouteError extends Error {
  status?: number;
  constructor(message: string, status?: number){
    super(message);
    this.status = status;
  }
}

export const route = createZodRoute({
  handleServerError: (e: Error) => {
    logger.error(e);
    if (e instanceof SafeRouteError) {
      return NextResponse.json(
        { message: e.message, status: e.status },
        {
          status: e.status,
        }
      )
    }
  }

  if (e instanceof AuthError) {
    return NextResponse.json(
      { 
        message: e.message,
      }
      {
        status: 401,
      }
    )
  }
})

export const authRoute = route.use(async ({ next }) => {
  const user = await getUser();
  if (!user) {
    throw new SafeRouteError("Session not found!")
  }

  return next({
    ctx: { user },
  })
})

// To use only on route orgaId
export const orgRoute = authRoute
  .defineMetadata(
    z.object({
      roles: z.string(),
      permissions: z.string()
    })
  )
  .use(async ({ next, metadata }) => {
    try {
      const organization = await getOrganization(metadata);

      return next({
        ctx: { organization },
      });
    } catch {
      throw new SafeRouteError("You need to be part of an organization")
    }
})