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
    const docTitle = title ? `${title} | HACK-MATRIX 2026` : seo.title;
    document.title = docTitle;

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (meta && description) meta.content = description;

    if (canonicalPath) {
      const base = seo.siteUrl.replace(/\/$/, "");
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = `${base}${canonicalPath}`;
    }
  }, [title, description, canonicalPath]);
}