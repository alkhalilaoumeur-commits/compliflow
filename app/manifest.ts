import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Compliflow — DSGVO-Tools",
    short_name: "Compliflow",
    description:
      "Suite für DSGVO-Pflichtdokumente: AVV-Generator, Verarbeitungsverzeichnis, Cookie-Banner.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2ea",
    theme_color: "#f6f2ea",
    lang: "de-DE",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "legal"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
