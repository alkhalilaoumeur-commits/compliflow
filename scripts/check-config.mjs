#!/usr/bin/env node
/**
 * check-config — zeigt im Terminal, welche Integrationen echt laufen und welche
 * im Mock/Fallback. Fragt dazu den /api/health-Endpoint des laufenden Servers ab
 * (gleiche Wahrheitsquelle wie lib/integrations-status.ts) — es werden keine
 * Secrets angezeigt, nur "gesetzt ja/nein" und der Modus.
 *
 * Nutzung:
 *   npm run check:config                      # gegen http://localhost:3000
 *   npm run check:config -- https://compliflow.de   # gegen Production
 *   CHECK_URL=https://compliflow.de npm run check:config
 *
 * Exit-Code: 0 wenn healthy (nichts "down"), 1 wenn eine Integration down ist,
 * 2 wenn der Server nicht erreichbar war. So auch in Scripts/CI nutzbar.
 */

const base = (process.argv[2] || process.env.CHECK_URL || "http://localhost:3000").replace(/\/$/, "");
const url = `${base}/api/health`;

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

const LEVEL = {
  ok: { icon: "✓", color: C.green, word: "LIVE" },
  degraded: { icon: "▲", color: C.yellow, word: "FALLBACK" },
  down: { icon: "✗", color: C.red, word: "DOWN" },
};

async function main() {
  let report;
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    report = await res.json();
  } catch (err) {
    console.error(`${C.red}Server nicht erreichbar:${C.reset} ${url}`);
    console.error(`${C.dim}${err.message}${C.reset}`);
    console.error(`\nLäuft der Server? Lokal: ${C.cyan}npm run dev${C.reset}. Oder Ziel-URL angeben:`);
    console.error(`  ${C.cyan}npm run check:config -- https://compliflow.de${C.reset}`);
    process.exit(2);
  }

  const overall = LEVEL[report.overall] || LEVEL.down;
  console.log("");
  console.log(`${C.bold}Compliflow — Integrations-Status${C.reset}  ${C.dim}(${url})${C.reset}`);
  console.log(`${C.dim}Umgebung: ${report.environment}${C.reset}`);
  console.log(
    `Gesamt: ${overall.color}${C.bold}${overall.icon} ${overall.word}${C.reset}` +
      `${report.healthy ? "" : `  ${C.red}— mind. eine Integration ist down${C.reset}`}`,
  );
  console.log("");

  for (const it of report.integrations) {
    const lv = LEVEL[it.level] || LEVEL.down;
    const label = it.label.padEnd(32);
    console.log(`${lv.color}${lv.icon}${C.reset} ${C.bold}${label}${C.reset} ${lv.color}${it.mode}${C.reset}`);
    console.log(`   ${C.dim}${it.detail}${C.reset}`);
    const varLine = it.vars
      .map((va) => `${va.present ? C.green + "●" : C.red + "○"}${C.reset} ${va.name}`)
      .join("   ");
    console.log(`   ${varLine}`);
    console.log("");
  }

  console.log(`${C.dim}● gesetzt   ○ fehlt   —   keine Secret-Werte werden angezeigt${C.reset}`);
  console.log("");

  process.exit(report.healthy ? 0 : 1);
}

main();
