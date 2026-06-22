import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest-Konfiguration für Compliflow.
// - react(): transformiert JSX/TSX für React-Komponententests.
// - resolve.tsconfigPaths: löst die "@/..."-Imports nativ auf (gleiche Pfade wie in der App).
// - environment "node": Standard für lib/-Logik & API-Routen (schnell, kein DOM).
//   React-Komponententests setzen per Datei-Kommentar `// @vitest-environment jsdom`
//   auf einen simulierten Browser um (siehe components/watermark/remove-button.test.tsx).
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});
