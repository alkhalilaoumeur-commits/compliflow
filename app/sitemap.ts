import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE = "https://compliflow.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/avv`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/vvt`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/impressum-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/datenschutz-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/widerrufsbelehrung-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/agb-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/cookie-banner-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/preise`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...blogPosts,
    { url: `${BASE}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/datenschutz`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/widerruf`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
