import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs'; // Use Node.js runtime for SSE streams
export const dynamic = 'force-dynamic';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = (redisUrl && redisToken) ? new Redis({ url: redisUrl, token: redisToken }) : null;

export async function GET() {
  const encoder = new TextEncoder();

  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      if (!redis) {
        // Fallback if Redis is not configured
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ viewers: 1 })}\n\n`));
        controller.close();
        return;
      }

      // Increment active viewers (with a TTL of 10s to auto-expire)
      const clientId = crypto.randomUUID();
      await redis.setex(`presence:${clientId}`, 10, "active");

      // Function to send current count
      const sendCount = async () => {
        try {
          const keys = await redis.keys('presence:*');
          const count = Math.max(1, keys.length);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ viewers: count })}\n\n`));
        } catch (e) {
          // Ignore
        }
      };

      // Send initial count
      await sendCount();

      // Poll every 5 seconds to send updates and refresh TTL
      const interval = setInterval(async () => {
        try {
          await redis.setex(`presence:${clientId}`, 10, "active");
          await sendCount();
        } catch (e) {
          clearInterval(interval);
          try { controller.close(); } catch (_) {}
        }
      }, 5000);

      // Clean up when client disconnects
      const cleanup = async () => {
        clearInterval(interval);
        try {
          await redis.del(`presence:${clientId}`);
        } catch (e) {}
      };

      // We rely on the client dropping the connection, and the stream's cancel method.
      return cleanup;
    },
    async cancel() {
      // Stream cancelled by client
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
