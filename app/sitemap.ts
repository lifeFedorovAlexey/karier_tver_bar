import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/cafe", "/menu", "/bathhouse", "/rental", "/contacts"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: path === "/menu" ? "weekly" : path ? "monthly" : "weekly",
      priority: path ? 0.8 : 1,
    }),
  );
}
