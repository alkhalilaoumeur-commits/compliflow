import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Banner-Generator | Compliflow",
  description:
    "DSGVO-konformes Cookie-Banner kostenlos erstellen. BGH-2025-konform mit gleich prominentem Accept/Reject. HTML+JS-Snippet zum direkten Einbau.",
  alternates: { canonical: "https://compliflow.de/cookie-banner-generator" },
  keywords: [
    "Cookie-Banner",
    "Cookie-Banner-Generator",
    "Cookie-Consent",
    "Cookie-Consent-Manager",
    "Consent-Management",
    "CMP",
    "TDDDG",
    "§ 25 TDDDG",
    "BGH Cookie",
    "BGH 2025 Cookie",
    "Reject All",
    "DSGVO Cookie",
    "Cookie-Banner kostenlos",
    "Cookie-Hinweis",
    "Google Analytics Consent",
    "Meta Pixel Consent",
  ],
  openGraph: {
    title: "Cookie-Banner-Generator kostenlos — § 25 TDDDG · BGH 2025",
    description:
      "Cookie-Banner mit gleich prominentem Reject-All erstellen. Lädt GA4, Meta Pixel & Co. erst nach Consent. HTML-Snippet zum Einfügen. Kostenlos, ohne Account.",
    url: "https://compliflow.de/cookie-banner-generator",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie-Banner-Generator — kostenlos",
    description:
      "BGH-2025-konformes Cookie-Banner in 6 Minuten. HTML+JS-Snippet. Kostenlos.",
  },
};

export default function CookieBannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
