import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  const url = `https://compliflow.de/blog/${post.slug}`;
  return {
    title: `${post.title} | Compliflow Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      siteName: "Compliflow",
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const inlineHtml = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, '<a href="$2" class="text-accent hover:text-ink underline underline-offset-2">$1</a>')
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" class="text-accent hover:text-ink underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>');

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-5 space-y-2 pl-0">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-3 font-body text-[16px] leading-relaxed text-ink-dim">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span dangerouslySetInnerHTML={{ __html: inlineHtml(item.replace(/^[-*\d.]\s*/, "")) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flushList(`list-${i}`);
      elements.push(
        <h2 key={i} className="mt-10 mb-4 font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(`list-${i}`);
      elements.push(
        <h3 key={i} className="mt-7 mb-3 font-display text-[20px] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[22px]">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line);
    } else if (line.match(/^\d+\.\s/)) {
      listItems.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.trim() === "") {
      flushList(`list-${i}`);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="my-4 font-body text-[16px] font-semibold text-ink">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.trim()) {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="my-4 font-body text-[16px] leading-[1.75] text-ink-dim"
           dangerouslySetInnerHTML={{ __html: inlineHtml(line) }} />
      );
    }
  });
  flushList("list-end");

  return elements;
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://compliflow.de/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: "Al-Khalil Aoumeur",
          url: "https://drvnautomatisations.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Compliflow",
          url: "https://compliflow.de",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://compliflow.de/blog/${post.slug}`,
        },
        inLanguage: "de-DE",
        articleSection: post.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://compliflow.de" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://compliflow.de/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://compliflow.de/blog/${post.slug}` },
        ],
      },
    ],
  };

  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const isCookiePost = post.category === "Cookie-Banner";
  const isVvtPost = post.category === "Verarbeitungsverzeichnis";
  const ctaHref = isCookiePost ? "/cookie-banner" : isVvtPost ? "/vvt" : "/avv";
  const ctaLabel = isCookiePost
    ? "Cookie-Banner Warteliste →"
    : isVvtPost
    ? "VVT jetzt erstellen →"
    : "AVV jetzt erstellen →";
  const ctaSidebarText = isCookiePost
    ? "Cookie-Banner kommt am 19. August 2026 — jetzt eintragen, 34 % Early-Bird-Rabatt sichern."
    : isVvtPost
    ? "Verarbeitungsverzeichnis kostenlos erstellen — Art. 30 DSGVO, kein Account nötig."
    : "AVV kostenlos generieren — in 10 Minuten, kein Account nötig.";

  return (
    <main id="main-content" className="relative z-10 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
            <a href="/blog" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
              ← Blog
            </a>
            <a href="/avv" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
              AVV
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

      <article className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12">
        <div className="border-b border-line py-12 lg:py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-5">
              {post.category}
            </p>
            <h1 className="font-display text-[32px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[44px] lg:text-[52px]">
              {post.title}
            </h1>
            <p className="mt-5 font-body text-[17px] leading-relaxed text-ink-dim">
              {post.excerpt}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:flex lg:items-end">
            <div className="border border-[rgba(226,221,209,0.6)] p-5 w-full">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-3">
                Artikel-Info
              </p>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-[13px]">
                  <span className="text-ink-faded">Veröffentlicht</span>
                  <span className="text-ink">{formatDate(post.date)}</span>
                </div>
                <div className="flex justify-between font-body text-[13px]">
                  <span className="text-ink-faded">Lesezeit</span>
                  <span className="text-ink">{post.readingTime} Minuten</span>
                </div>
                <div className="flex justify-between font-body text-[13px]">
                  <span className="text-ink-faded">Kategorie</span>
                  <span className="text-ink">{post.category}</span>
                </div>
              </div>
              <a
                href={ctaHref}
                className="mt-5 block w-full btn-primary text-center h-10 leading-10 font-body text-[13px] font-medium tracking-tight"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 py-12 lg:py-16">
          <div className="col-span-12 lg:col-span-8">
            {renderContent(post.content)}
          </div>
          <aside className="col-span-12 lg:col-span-3 lg:col-start-10">
            <div className="sticky top-8 border-l-2 border-accent pl-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
                Direkt loslegen
              </p>
              <p className="font-body text-[14px] text-ink-dim leading-relaxed mb-4">
                {ctaSidebarText}
              </p>
              <a
                href={ctaHref}
                className="btn-primary inline-flex h-10 items-center justify-center px-5 font-body text-[13px] font-medium tracking-tight w-full"
              >
                Jetzt generieren
              </a>
            </div>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded mb-8">
              Weitere Artikel
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {others.map((p) => (
                <a key={p.slug} href={`/blog/${p.slug}`} className="group block border-t border-line pt-6 hover:opacity-80 transition-opacity">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
                    {p.category}
                  </p>
                  <h3 className="font-display text-[20px] font-medium leading-snug tracking-tight text-ink group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-body text-[14px] text-ink-dim">{p.readingTime} Min. Lesezeit</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
