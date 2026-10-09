import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis only if keys are present
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create a new ratelimiter that allows 5 requests per 10 seconds
const ratelimit = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "10 s"),
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!redis || !ratelimit) {
      return NextResponse.json({ error: "Analytics API not configured" }, { status: 501 });
    }

    const { projectId, action } = await req.json();

    if (!projectId || !action || !["view", "like"].includes(action)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Rate Limiting by IP
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Increment corresponding key
    const key = `project:${action}s:${projectId}`;
    const newValue = await redis.incr(key);

    return NextResponse.json({ success: true, newValue });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!redis) {
      return NextResponse.json({ views: 0, likes: 0 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "projectId required" }, { status: 400 });
    }

    const [views, likes] = await Promise.all([
      redis.get(`project:views:${projectId}`),
      redis.get(`project:likes:${projectId}`)
    ]);

    return NextResponse.json({ 
      views: views || 0, 
      likes: likes || 0 
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
