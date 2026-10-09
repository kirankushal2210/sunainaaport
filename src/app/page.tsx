import { prisma } from "@/lib/prisma";
import PortfolioClient from "./PortfolioClient";

import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = (redisUrl && redisToken) ? new Redis({ url: redisUrl, token: redisToken }) : null;

export const revalidate = 3600; // ISR cache revalidates every hour

export default async function Home() {
  let initialProjects = null;
  let initialExperiences = null;

  try {
    const CACHE_KEY = "portfolio:data";
    
    // 1. Try Cache First
    if (redis) {
      const cached = await redis.get<{ projects: any[], experiences: any[] }>(CACHE_KEY);
      if (cached && cached.projects) {
        return (
          <PortfolioClient
            initialProjects={cached.projects}
            initialExperiences={cached.experiences}
          />
        );
      }
    }

    // 2. Fetch from DB if cache miss
    const [projects, experiences] = await Promise.all([
      prisma.project.findMany({ orderBy: { created_at: "desc" } }),
      prisma.experience.findMany(),
    ]);
    
    // 3. Set Cache asynchronously (fire and forget)
    if (redis) {
      redis.set(CACHE_KEY, { projects, experiences }, { ex: 3600 }).catch(console.error);
    }

    if (projects && projects.length > 0) {
      initialProjects = projects as any;
    }
    if (experiences && experiences.length > 0) {
      initialExperiences = experiences;
    }
  } catch (error) {
    console.warn("Database unreachable — serving fallback data. Code:", (error as any)?.code || "UNKNOWN");
  }

  return (
    <PortfolioClient
      initialProjects={initialProjects}
      initialExperiences={initialExperiences}
    />
  );
}
