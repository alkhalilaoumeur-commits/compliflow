import { BLOG_POSTS } from "@/lib/blog-posts";
import type { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Blog — DSGVO-Wissen für Selbstständige | Compliflow",
  description:
    "Praxisnahe Artikel zu AVV, Verarbeitungsverzeichnis, Cookie-Banner und DSGVO-Pflichten für Freelancer und kleine Unternehmen in Deutschland.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <main className="relative z-10 min-h-screen">
      <header className="border-b border-[rgba(226,221,209,0.7)]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 flex items-center justify-between py-5">
          <a href="/" className="flex items-baseline gap-2.5">
            <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
              Compliflow
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded md:inline">
              DSGVO Suite
            </span>
          </a>
          <nav className="flex items-center gap-5 md:gap-7">
            <a href="/" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
              Startseite
            </a>
            <a href="/avv" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
              AVV
            </a>
            <a href="/vvt" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
              VVT
            </a>
            <a href="/blog" className="hidden font-body text-[14px] text-ink font-medium md:inline">
              Blog
            </a>
            <a
              href="/avv"
              className="hidden md:inline-flex btn-primary h-9 items-center justify-center gap-2 px-4 font-body text-[13px] font-medium tracking-tight"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
              Kostenlos starten
            </a>
            <MobileNav />
          </nav>
        </div>
      </header>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-16 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
            Blog
          </p>
          <h1 className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px] lg:text-[72px]">
            DSGVO-Wissen,<br />
            <span className="italic">das hilft.</span>
          </h1>
          <p className="mt-6 font-body text-[17px] leading-relaxed text-ink-dim max-w-xl">
            Praxisnahe Artikel zu AVV, Verarbeitungsverzeichnis und DSGVO-Pflichten — ohne Juristendeutsch.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-16">
        <a
          href={`/blog/${featured.slug}`}
          className="group grid grid-cols-12 gap-6 border-b border-line pb-12 mb-12 hover:opacity-90 transition-opacity"
        >
          <div className="col-span-12 lg:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {featured.category}
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink-faded">
              {formatDate(featured.date)}
            </p>
            <p className="mt-1 font-mono text-[11px] text-ink-faded">
              {featured.readingTime} Min. Lesezeit
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display text-[28px] font-medium leading-[1.1] tracking-[-0.01em] text-ink group-hover:text-accent transition-colors sm:text-[36px]">
              {featured.title}
            </h2>
            <p className="mt-4 font-body text-[16px] leading-relaxed text-ink-dim">
              {featured.excerpt}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:flex lg:items-end lg:justify-end">
            <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink border-b border-ink pb-0.5">
              Artikel lesen →
            </span>
          </div>
        </a>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {rest.map((post, i) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group block py-10 hover:opacity-90 transition-opacity ${
                i % 2 === 0 ? "md:border-r md:border-line md:pr-10" : "md:pl-10"
              } border-b border-line`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                {post.category}
              </p>
              <h3 className="font-display text-[22px] font-medium leading-[1.15] tracking-[-0.01em] text-ink group-hover:text-accent transition-colors sm:text-[26px]">
                {post.title}
              </h3>
              <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-dim">
                {post.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <span className="font-mono text-[11px] text-ink-faded">
                  {formatDate(post.date)}
                </span>
                <span className="font-mono text-[11px] text-ink-faded">·</span>
                <span className="font-mono text-[11px] text-ink-faded">
                  {post.readingTime} Min.
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-[24px] font-medium tracking-tight text-ink">
              Direkt loslegen?
            </p>
            <p className="mt-1 font-body text-[15px] text-ink-dim">
              AVV kostenlos generieren — kein Account, keine Wartezeit.
            </p>
          </div>
          <a
            href="/avv"
            className="btn-primary inline-flex h-11 items-center justify-center gap-2 px-6 font-body text-[14px] font-medium tracking-tight whitespace-nowrap"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            AVV jetzt erstellen
          </a>
        </div>
      </section>

      <footer className="border-t border-line bg-bg">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded">
            © 2026 Al-Khalil Aoumeur · Compliflow · Stuttgart
          </span>
          <nav className="flex items-center gap-5">
            <a href="/impressum" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faded hover:text-ink">Impressum</a>
            <a href="/datenschutz" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faded hover:text-ink">Datenschutz</a>
            <a href="/agb" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faded hover:text-ink">AGB</a>
            <a href="/widerruf" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faded hover:text-ink">Widerruf</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
