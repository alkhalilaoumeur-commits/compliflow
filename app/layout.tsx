import type { Metadata } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { FAQS } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
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

const SITE_URL = "https://compliflow.de";
const SITE_NAME = "Compliflow";
const TITLE = "Compliflow — DSGVO-Tools für deutsche Selbstständige";
const DESCRIPTION =
  "AVV-Generator, Verarbeitungsverzeichnis und Cookie-Banner in einer Suite. DSGVO-konforme Pflichtdokumente in Minuten statt Tagen. Launch Tool 1 am 17. Juni 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Compliflow" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AVV Generator",
    "AVV Vorlage",
    "Auftragsverarbeitungsvertrag",
    "DSGVO Art 28",
    "DSGVO",
    "Verarbeitungsverzeichnis",
    "VVT Vorlage",
    "DSGVO Art 30",
    "Cookie Banner Generator",
    "Cookie Consent",
    "TTDSG",
    "Compliance Tools",
    "Datenschutz Tools DACH",
    "DSGVO konform",
    "Schrems II",
  ],
  authors: [{ name: "Al-Khalil Aoumeur", url: "https://drvnautomatisations.com" }],
  creator: "Al-Khalil Aoumeur",
  publisher: "DRVN",
  category: "Software",
  alternates: {
    canonical: SITE_URL,
    languages: { "de-DE": SITE_URL },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#f6f2ea",
  colorScheme: "light",
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "DSGVO-Compliance-Tool-Suite für deutsche Selbstständige und Agenturen.",
        founder: { "@type": "Person", name: "Al-Khalil Aoumeur", jobTitle: "Solo-Builder" },
        foundingDate: "2026",
        areaServed: [
          { "@type": "Country", name: "Deutschland" },
          { "@type": "Country", name: "Österreich" },
          { "@type": "Country", name: "Schweiz" },
        ],
        sameAs: ["https://drvnautomatisations.com"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Stuttgart",
          addressCountry: "DE",
        },
        email: "hello@compliflow.de",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: "de-DE",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/avv#app`,
        name: "Compliflow AVV-Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        description:
          "Erstelle DSGVO-konforme Auftragsverarbeitungs-Verträge nach Art. 28 in 2 Minuten — mit Live-Vorschau, PDF-Export und Custom-Branding.",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR", availability: "https://schema.org/PreOrder", url: `${SITE_URL}/avv` },
          { "@type": "Offer", name: "Pro Single", price: "29", priceCurrency: "EUR", availability: "https://schema.org/PreOrder" },
          { "@type": "Offer", name: "Pro Agency", price: "19", priceCurrency: "EUR", availability: "https://schema.org/PreOrder" },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/vvt#app`,
        name: "Compliflow Verarbeitungsverzeichnis",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        description:
          "Verarbeitungsverzeichnis nach Art. 30 DSGVO erstellen — strukturiert, prüfungssicher, mit Branchen-Vorlagen.",
        offers: { "@type": "Offer", price: "29", priceCurrency: "EUR", availability: "https://schema.org/PreOrder" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/cookie-banner#app`,
        name: "Compliflow Cookie-Banner",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        description:
          "TTDSG- und DSGVO-konformer Cookie-Banner mit Audit-Trail und Google Consent Mode V2.",
        offers: { "@type": "Offer", price: "9", priceCurrency: "EUR", availability: "https://schema.org/PreOrder" },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        ],
      },
    ],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
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
