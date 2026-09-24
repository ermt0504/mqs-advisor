import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ idea: z.string().trim().min(10).max(2000), lang: z.enum(["fr", "en"]) });

export const recommendWebsite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI not configured");
    const { streamText, Output } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const language = data.lang === "fr" ? "French" : "English";
    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: `You are a senior product & web strategist at MQS_Advisor, a product studio and incubator (Canada, France, Senegal, Djibouti). Given a business idea, produce concise, specific website recommendations. Answer in ${language}. Keep each text field under 40 words; 3 to 5 items per list.`,
      prompt: data.idea,
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          audience: z.string(),
          pages: z.array(z.string()),
          features: z.array(z.string()),
          design: z.string(),
          nextSteps: z.array(z.string()),
        }),
      }),
      providerOptions: {
        openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
      },
    });
    const o = await result.output;
    const clip = (a: string[]) => a.slice(0, 5);
    return { ...o, pages: clip(o.pages), features: clip(o.features), nextSteps: clip(o.nextSteps) };
  });
