import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://compliflow.de"),
  title: {
    default: "Compliflow — DSGVO-Tools für deutsche Selbstständige",
    template: "%s · Compliflow",
  },
  description:
    "AVV, Verarbeitungsverzeichnis, Cookie-Banner. In Minuten erstellt statt Tagen recherchiert. Tools die DSGVO-Bußgelder vermeiden — ohne Anwalt.",
  keywords: [
    "AVV Generator",
    "DSGVO",
    "Verarbeitungsverzeichnis",
    "Cookie Banner",
    "Compliance Tools",
    "Datenschutz Tools",
    "DACH",
  ],
  authors: [{ name: "Al-Khalil Aoumeur" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://compliflow.de",
    siteName: "Compliflow",
    title: "Compliflow — DSGVO-Tools für deutsche Selbstständige",
    description:
      "AVV, Verarbeitungsverzeichnis, Cookie-Banner. In Minuten erstellt statt Tagen recherchiert.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliflow — DSGVO-Tools für deutsche Selbstständige",
    description: "AVV, Verarbeitungsverzeichnis, Cookie-Banner. Tools statt Anwalt.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://compliflow.de/#org",
      name: "Compliflow",
      url: "https://compliflow.de",
      description: "DSGVO-Compliance-Tool-Suite für deutsche Selbstständige und Agenturen.",
      founder: { "@type": "Person", name: "Al-Khalil Aoumeur" },
      areaServed: ["DE", "AT", "CH"],
    },
    {
      "@type": "WebSite",
      "@id": "https://compliflow.de/#website",
      url: "https://compliflow.de",
      name: "Compliflow",
      publisher: { "@id": "https://compliflow.de/#org" },
      inLanguage: "de-DE",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="compliflow.de"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
