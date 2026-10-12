import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { langSchema } from "../content";

export default defineTool({
  name: "recommend_website",
  title: "Recommend a website for an idea",
  description: "Use the MQS AI advisor to get personalized website recommendations (pages, features, design, next steps) for a business idea.",
  inputSchema: {
    idea: z.string().trim().min(10).max(2000).describe("The business idea, in a few sentences."),
    lang: langSchema,
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ idea, lang }) => {
    const { runAdvisor } = await import("@/lib/advisor.core");
    try {
      const r = await runAdvisor(idea, lang);
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }], structuredContent: { recommendation: r } };
    } catch {
      throw new ToolError("The advisor is unavailable right now. Please retry later.");
    }
  },
});
