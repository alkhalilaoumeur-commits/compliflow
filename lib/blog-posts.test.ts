import { describe, it, expect } from "vitest";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-posts";

describe("getBlogPost", () => {
  it("findet einen Post bei gültigem Slug", () => {
    const post = getBlogPost("avv-dsgvo-art-28-leitfaden-2026");
    expect(post).toBeDefined();
    expect(post?.slug).toBe("avv-dsgvo-art-28-leitfaden-2026");
  });

  it("liefert das exakte Objekt aus BLOG_POSTS zurück", () => {
    const erwartet = BLOG_POSTS[0];
    expect(getBlogPost(erwartet.slug)).toBe(erwartet);
  });

  it("findet jeden in BLOG_POSTS definierten Slug", () => {
    for (const p of BLOG_POSTS) {
      expect(getBlogPost(p.slug)?.slug).toBe(p.slug);
    }
  });

  it("liefert undefined bei unbekanntem Slug", () => {
    expect(getBlogPost("gibt-es-nicht-xyz")).toBeUndefined();
  });

  it("liefert undefined bei leerem Slug", () => {
    expect(getBlogPost("")).toBeUndefined();
  });
});
