import type { MetadataRoute } from "next";

const BASE = "https://compliflow.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/avv`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/#tools`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/#was`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/#faq`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/datenschutz`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/widerruf`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
