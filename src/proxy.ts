import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only initialize Ratelimit if keys are present
const ratelimit = (redisUrl && redisToken)
  ? new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests per 10 seconds
      ephemeralCache: new Map(),
    })
  : null;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Rate-Limit POST requests to /api/chat and any form submissions (Next-Action header)
  if (req.method === "POST" && (pathname.startsWith("/api/chat") || req.headers.has("Next-Action"))) {
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
      const { success } = await ratelimit.limit(`ratelimit_${ip}`);
      
      if (!success) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
