import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Eigene Config nur für den Hero-Visual-Generator.
// Grund: Das Projekt hat keinen eigenständigen TypeScript-Runner (kein tsx/esbuild-CLI).
// Vitest ist der einzige Weg, eine .tsx mit "@/..."-Imports auszuführen — deshalb läuft
// der Generator als Vitest-Lauf, aber mit eigener Config und eigenem Include-Muster
// (*.gen.tsx statt *.test.ts). So taucht er in "npm test" NICHT auf und verlangsamt
// die Testsuite nicht.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["scripts/hero-visual/*.gen.tsx"],
    globals: true,
    testTimeout: 60_000,
  },
});
