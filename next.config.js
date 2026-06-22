/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HSTS nur in Production — verhindert HTTPS-Loop auf localhost
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `script-src 'self' 'unsafe-inline' https://plausible.io${!isProd ? " 'unsafe-eval'" : ""}`,
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "connect-src 'self' https://plausible.io https://api.stripe.com",
      "img-src 'self' data: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      // upgrade-insecure-requests nur in Production — bricht HTTP-Dev-Server
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Standalone-Output NUR via ENV-Flag aktivieren.
//
// Warum: `output: "standalone"` permanent zu aktivieren erzeugt nach jedem
// `npm run build` ein .next/standalone-Verzeichnis. Wenn danach `npm run dev`
// läuft, mischen sich die Standalone-Chunks mit den Dev-Hot-Reload-Chunks und
// der Webpack-Resolver findet plötzlich Module nicht mehr ("Cannot find module
// './948.js'") — das "Frontend spinnt"-Problem.
//
// Lokal:        BUILD_STANDALONE nicht setzen → normaler Build, dev läuft sauber
// Production:   BUILD_STANDALONE=1 npm run build (siehe package.json:build:standalone)
// ─────────────────────────────────────────────────────────────────────────────
const useStandalone = process.env.BUILD_STANDALONE === "1";

// ─────────────────────────────────────────────────────────────────────────────
// Dev-Only No-Cache-Header
//
// Zwingt Browser-Cache in Dev-Mode auf "nie cachen". Verhindert das Problem
// dass Safari/Chrome eine HTML-Page mit altem CSS-Hash gespeichert hat und nach
// Hot-Reload nicht mehr funktioniert (klassischer "Frontend spackt"-Bug).
//
// In Production: normales Cache-Verhalten, sonst wird die Seite quälend langsam.
// ─────────────────────────────────────────────────────────────────────────────
const devNoCacheHeaders = isProd
  ? []
  : [
      { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
      { key: "Pragma", value: "no-cache" },
      { key: "Expires", value: "0" },
    ];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    instrumentationHook: true,
  },
  ...(useStandalone ? { output: "standalone" } : {}),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, ...devNoCacheHeaders],
      },
    ];
  },
};

module.exports = nextConfig;
