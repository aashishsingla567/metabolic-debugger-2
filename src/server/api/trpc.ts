/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { type Session } from "next-auth";

import { getServerAuthSession } from "@/server/auth";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    const ip = parts[0]?.trim();
    if (ip) {
      return ip;
    }
  }
  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

function checkRateLimit(identifier: string): {
  success: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const info = rateLimitMap.get(identifier);

  if (!info || now > info.resetTime) {
    const newResetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(identifier, { count: 1, resetTime: newResetTime });
    return {
      success: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: newResetTime,
    };
  }

  if (info.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { success: false, remaining: 0, resetTime: info.resetTime };
  }

  info.count++;
  return {
    success: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - info.count,
    resetTime: info.resetTime,
  };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    session: session as Session | null,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const ratelimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const headers = ctx.headers instanceof Headers ? ctx.headers : new Headers();
  const ip = getClientIP(headers);
  const { success, resetTime } = checkRateLimit(ip);

  if (!success) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    });
  }

  return next();
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path ?? "<no-path>"} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 *
 * @see https://trpc.io/docs/procedures
 */
export const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(ratelimitMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(ratelimitMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
