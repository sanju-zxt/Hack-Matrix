# HACK-MATRIX 2026

Landing site for **HACK-MATRIX**, the 8-hour inter-collegiate hackathon hosted by Vijaya Vittala Institute of Technology (VVIT), Bengaluru.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- sharp (asset/image pipeline)
- Deploy target: Vercel (SPA)

## Local development

```bash
npm install
npm run dev        # start dev server
npm run generate:assets  # regenerate favicon / apple-touch-icon / og-image from the logo
npm run build      # type-check + production build
npm run preview    # preview the production build locally
```

## Go-live checklist

1. **Fill in `src/data/eventConfig.ts`** — `registration.googleFormUrl`, `contact` (email / phone / socials), and `seo.siteUrl` (replace `https://hack-matrix.example.com` with the real production URL).
2. **Run `npm run generate:assets`** to regenerate OG/favicon assets from `public/vvitlogo.jpg` (logo source: copy of `vvitlogo.jpg`; override with `LOGO` env var).
3. **Deploy to Vercel** (framework preset "Vite" picks up `vercel.json` automatically).
4. **Optional** — drop partner logo PNGs into `/public` and reference them in `sponsors.partners` in the config.

> Note: `index.html` embeds SEO meta, canonical URLs, and JSON-LD structured data — values are currently the placeholder domain, so update `seo.siteUrl` and regenerate before launch.