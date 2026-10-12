import { z } from "zod";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";

export const langSchema = z.enum(["fr", "en"]).default("fr").describe("Language: fr (default) or en.");
export const dict = (lang: "fr" | "en") => (lang === "en" ? en : fr);

export const toProject = (p: (typeof fr)["projects"][number], lang: "fr" | "en") => ({
  slug: p.slug,
  name: p.name,
  country: p.country,
  sector: p.sector,
  status: p.status,
  url: p.url,
  description: p.desc,
  confidential: p.confidential,
  page: `${lang === "en" ? "/en/projects/" : "/projets/"}${p.slug}`,
});
