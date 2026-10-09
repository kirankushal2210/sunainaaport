import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Optionally fetch projects if we add dynamic /projects/[id] pages in the future
  // const projects = await prisma.project.findMany();
  // const projectUrls = projects.map((p) => ({
  //   url: `${baseUrl}/projects/${p.id}`,
  //   lastModified: p.created_at,
  // }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/client-dashboard`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // ...projectUrls,
  ];
}
