import { useRouterState } from "@tanstack/react-router";
import { fr } from "./fr";
import { en } from "./en";

export type Lang = "fr" | "en";
export type PageKey = "home" | "vision" | "services" | "incubator" | "projects" | "presence" | "team" | "digiafrica" | "join" | "contact";
export type NavKey = Exclude<PageKey, "home">;

export const DICTS = { fr, en };

export const PATHS: Record<Lang, Record<PageKey, string>> = {
  fr: {
    home: "/",
    vision: "/vision",
    services: "/services",
    incubator: "/incubateur",
    projects: "/projets",
    presence: "/presence",
    team: "/equipe",
    digiafrica: "/digiafrika",
    join: "/rejoindre",
    contact: "/contact",
  },
  en: {
    home: "/en",
    vision: "/en/vision",
    services: "/en/services",
    incubator: "/en/incubator",
    projects: "/en/projects",
    presence: "/en/presence",
    team: "/en/team",
    digiafrica: "/en/digiafrika",
    join: "/en/join",
    contact: "/en/contact",
  },
};

export const projectPath = (lang: Lang, slug: string) => `${PATHS[lang].projects}/${slug}`;

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** Equivalent path in the other language. */
export function switchPath(pathname: string, to: Lang): string {
  const from = langFromPath(pathname);
  if (from === to) return pathname;
  const clean = pathname.replace(/\/$/, "") || "/";
  const keys = Object.keys(PATHS[from]) as PageKey[];
  for (const k of keys) if (PATHS[from][k] === clean) return PATHS[to][k];
  const proj = PATHS[from].projects + "/";
  if (clean.startsWith(proj)) return PATHS[to].projects + "/" + clean.slice(proj.length);
  return PATHS[to].home;
}

export function useLang(): Lang {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return langFromPath(pathname);
}

export function useT() {
  const lang = useLang();
  return { lang, t: DICTS[lang], paths: PATHS[lang] };
}

/** Per-page head metadata with hreflang alternates. */
export function seo(lang: Lang, page: PageKey, override?: { title: string; description: string; slug?: string }) {
  const m = override ?? DICTS[lang].meta[page];
  const frPath = override?.slug ? projectPath("fr", override.slug) : PATHS.fr[page];
  const enPath = override?.slug ? projectPath("en", override.slug) : PATHS.en[page];
  return {
    meta: [
      { title: m.title },
      { name: "description", content: m.description },
      { property: "og:title", content: m.title },
      { property: "og:description", content: m.description },
      { property: "og:type", content: override?.slug ? "article" : "website" },
      { property: "og:url", content: lang === "fr" ? frPath : enPath },
      { property: "og:site_name", content: "MQS_Advisor" },
      { property: "og:locale", content: lang === "fr" ? "fr_FR" : "en_CA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: m.title },
      { name: "twitter:description", content: m.description },
    ],
    links: [
      { rel: "canonical", href: lang === "fr" ? frPath : enPath },
      { rel: "alternate", hrefLang: "fr", href: frPath },
      { rel: "alternate", hrefLang: "en", href: enPath },
      { rel: "alternate", hrefLang: "x-default", href: frPath },
    ],
  };
}
