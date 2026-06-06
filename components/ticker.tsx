const HEADLINES = [
  "1,2 Mrd. € · Meta-Bußgeld für DSGVO-Verstoß (2023)",
  "390 Mio. € · Meta Ireland · Verarbeitung ohne Rechtsgrundlage",
  "20 Mio. € · H&M Hamburg · Mitarbeiter-Überwachung",
  "10,4 Mio. € · notebooksbilliger.de · Videoüberwachung",
  "525.000 € · Vodafone · fehlerhaftes Verarbeitungsverzeichnis",
  "65.000 € · Mittelständler Berlin · fehlender AVV mit Cloud-Dienstleister",
  "9,55 Mio. € · 1&1 · unzureichende TOMs",
  "35,3 Mio. € · H&M · Personalakten ohne Rechtsgrundlage",
  "Aktuell · jede Minute neue DSGVO-Verfahren in DACH",
];

export function Ticker() {
  const items = [...HEADLINES, ...HEADLINES];
  return (
    <div
      className="relative flex items-center gap-3 overflow-hidden border-y border-line bg-bg-soft py-3"
      aria-label="Aktuelle DSGVO-Bußgelder"
    >
      <div className="z-10 flex items-center gap-2 pl-6 pr-3 md:pl-12 lg:pl-20">
        <span className="pulse-dot" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          Live · Bußgeld-Radar
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track">
          {items.map((h, i) => (
            <span
              key={i}
              className="mx-6 inline-flex items-center font-mono text-[12px] uppercase tracking-[0.15em] text-ink-dim"
            >
              <span className="mr-6 text-accent">▲</span>
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
