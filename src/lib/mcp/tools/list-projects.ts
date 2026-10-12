import { defineTool } from "@lovable.dev/mcp-js";
import { dict, langSchema, toProject } from "../content";

export default defineTool({
  name: "list_projects",
  title: "List MQS projects",
  description: "List the products and projects built or incubated by MQS_Advisor, with country, sector and status.",
  inputSchema: { lang: langSchema },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const projects = dict(lang).projects.map((p) => toProject(p, lang));
    return {
      content: [{ type: "text", text: projects.map((p) => `${p.name} (${p.country}, ${p.status}) — ${p.description || "—"}`).join("\n") }],
      structuredContent: { projects },
    };
  },
});
