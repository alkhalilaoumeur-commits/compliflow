/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Verhindert Clickjacking: Seite kann nicht in iframes eingebettet werden
  { key: "X-Frame-Options", value: "DENY" },
  // Browser rät nicht den Content-Type — verhindert MIME-Type-Sniffing-Angriffe
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sendet beim Navigieren zu externen Seiten nur den Origin, keine volle URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deaktiviert Browser-Features die Compliflow nicht braucht
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Erzwingt HTTPS für 1 Jahr (nur in Production aktiv)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Content Security Policy — erlaubt nur vertrauenswürdige Quellen
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js braucht 'unsafe-inline' für Style-Injection; Fonts von Google
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Plausible Analytics Script
      "script-src 'self' 'unsafe-inline' https://plausible.io",
      // Stripe Checkout läuft auf js.stripe.com
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      // API-Calls: eigener Server + Stripe
      "connect-src 'self' https://plausible.io https://api.stripe.com",
      // Bilder: eigener Server + og-image-Generierung
      "img-src 'self' data: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: undefined,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
