import { useEffect } from "react";
import { seo } from "../data/eventConfig";

interface Meta {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

/** Lightweight per-page SEO: sets <title>, meta description + canonical. */
export function usePageMeta({ title, description, canonicalPath }: Meta = {}) {
  useEffect(() => {
    const normalizedTitle = title?.trim();
    document.title = normalizedTitle
      ? `${normalizedTitle} | HACK-MATRIX 2026`
      : seo.title;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description?.trim() || seo.description;

    const base = seo.siteUrl.replace(/\/+$/, "");
    const requestedPath = canonicalPath?.trim();
    const path = requestedPath && requestedPath !== "/"
      ? `/${requestedPath.replace(/^\/+/, "")}`
      : "/";

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${base}${path}`;
  }, [title, description, canonicalPath]);
}