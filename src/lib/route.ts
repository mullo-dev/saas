import { logger } from "better-auth";
import { createZodRoute } from "next-zod-route"
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { getUser } from "./auth-session";
import { z } from "zod"
import { metadata } from "@app/layout";
import { getOrganizationById } from "@/actions/organization/actions/get";

export class SafeRouteError extends Error {
  status?: number;
  constructor(message: string, status?: number){
    super(message);
    this.status = status;
  }
}

export const route = createZodRoute({
  handleServerError: (e: Error): Response => {
    logger.error(e.message);
    if (e instanceof SafeRouteError) {
      return NextResponse.json(
        { message: e.message, status: e.status },
        {
          status: e.status,
        }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

export const authRoute = route.use(async ({ next }) => {
  const user = await getUser();
  if (!user) {
    throw new SafeRouteError("Session not found!")
  }

  return next({
    ctx: { user },
  })
});

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
      if (!metadata?.roles) {
        throw new SafeRouteError("Organization ID is required");
      }
      const result = await getOrganizationById({ organizationId: metadata.roles });
      if (!result?.data?.success) {
        throw new SafeRouteError("You need to be part of an organization");
      }

      return next({
        ctx: { organization: result.data.organization },
      });
    } catch {
      throw new SafeRouteError("You need to be part of an organization")
    }
  });