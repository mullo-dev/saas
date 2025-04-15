import { logger } from "better-auth";
import { createZodRoute } from "next-zod-route"
import { NextResponse } from "next/server";
import { getUser } from "./auth-session";
import { z } from "zod"
import { prisma } from "./prisma";

export class SafeRouteError extends Error {
  status?: number;
  constructor(message: string, status?: number){
    super(message);
    this.status = status;
  }
}

export const route = createZodRoute({
  handleServerError: (e: Error) => {
    logger.error(e.message);
    
    if (e instanceof SafeRouteError) {
      return NextResponse.json(
        { message: e.message, status: e.status },
        { status: e.status }
      );
    }

    // Handle auth errors
    if (e.message.includes("auth")) {
      return NextResponse.json(
        { message: e.message },
        { status: 401 }
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
    throw new SafeRouteError("Session not found!");
  }

  return next({
    ctx: { user },
  });
});

// To use only on route orgaId
export const orgRoute = authRoute
  .defineMetadata(
    z.object({
      organizationId: z.string(),
      roles: z.string(),
      permissions: z.string()
    })
  )
  .use(async ({ next, metadata }) => {
    if (!metadata) {
      throw new SafeRouteError("Metadata is required");
    }

    try {
      const organization = await prisma.organization.findUnique({
        where: { id: metadata.organizationId }
      });

      if (!organization) {
        throw new SafeRouteError("Organization not found");
      }

      return next({
        ctx: { organization },
      });
    } catch (e) {
      throw new SafeRouteError("You need to be part of an organization");
    }
  });