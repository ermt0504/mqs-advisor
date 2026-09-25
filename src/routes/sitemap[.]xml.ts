import { createFileRoute } from "@tanstack/react-router";
import { DICTS, PATHS, projectPath, type PageKey } from "@/i18n";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const pairs: [string, string][] = (Object.keys(PATHS.fr) as PageKey[]).map((k) => [PATHS.fr[k], PATHS.en[k]]);
        for (const p of DICTS.fr.projects) if (!p.confidential) pairs.push([projectPath("fr", p.slug), projectPath("en", p.slug)]);
        const alt = (fr: string, en: string) =>
          `<xhtml:link rel="alternate" hreflang="fr" href="${origin}${fr}"/><xhtml:link rel="alternate" hreflang="en" href="${origin}${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${origin}${fr}"/>`;
        const urls = pairs
          .flatMap(([fr, en]) => [fr, en].map((loc) => `<url><loc>${origin}${loc}</loc>${alt(fr, en)}</url>`))
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
