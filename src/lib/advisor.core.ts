import { z } from "zod";

export const SITE_PAGES = ["services", "incubator", "projects", "presence", "digiafrica", "team", "contact"] as const;

export async function runAdvisor(idea: string, lang: "fr" | "en") {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI not configured");
  const { streamText, Output } = await import("ai");
  const { createOpenAI } = await import("@ai-sdk/openai");
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const language = lang === "fr" ? "French (français), never English" : "English";
  const item = z.object({ name: z.string(), example: z.string() });
  const result = streamText({
    model: lovable.responses("openai/gpt-6-astra"),
    system: `You are a senior product & web strategist at MQS_Advisor, a product studio and incubator (Canada HQ, France, Senegal, Djibouti; operating in Africa as DIGIAFRICA for public/government platforms). Given a business idea, produce concise, specific website recommendations. Write EVERY field in ${language}.
For each page and feature, give a short name and a concrete example tied to the idea (real content, a sample headline, a user scenario). Keep each text under 35 words; 3 to 5 items per list.
In "links", pick 1 to 3 MQS_Advisor site pages most useful for this visitor: services (what we build), incubator (turn the idea into a company), projects (similar work: Saturne Pro, Taxi Conventionné Médical, Waahlex, Martee), presence, digiafrica (public/government projects in Africa), team, contact. Give a one-sentence reason each.`,
    prompt: idea,
    output: Output.object({
      schema: z.object({
        summary: z.string(),
        audience: z.string(),
        pages: z.array(item),
        features: z.array(item),
        design: z.string(),
        nextSteps: z.array(z.string()),
        links: z.array(z.object({ page: z.enum(SITE_PAGES), reason: z.string() })),
      }),
    }),
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  const o = await result.output;
  return {
    ...o,
    pages: o.pages.slice(0, 5),
    features: o.features.slice(0, 5),
    nextSteps: o.nextSteps.slice(0, 5),
    links: o.links.slice(0, 3),
  };
}
