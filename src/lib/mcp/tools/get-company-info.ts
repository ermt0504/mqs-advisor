import { defineTool } from "@lovable.dev/mcp-js";
import { dict, langSchema } from "../content";

export default defineTool({
  name: "get_company_info",
  title: "Get MQS company info",
  description: "Get MQS_Advisor's services, founding team and DIGIAFRICA ongoing projects.",
  inputSchema: { lang: langSchema },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const t = dict(lang);
    const services = t.services.items.map((s) => ({ title: s.title, text: s.text, deliverables: [...s.deliverables] }));
    const team = t.team.members.map((m) => ({ role: m.role, origin: m.origin, bio: m.bio }));
    const digiafrika = t.digiafrica.projects.map((p) => ({ country: p.country, title: p.title, text: p.text }));
    const text = [
      "Services:", ...services.map((s) => `- ${s.title}: ${s.text}`),
      "Team:", ...team.map((m) => `- ${m.role} (${m.origin}): ${m.bio}`),
      "DIGIAFRICA:", ...digiafrika.map((p) => `- ${p.title} (${p.country}): ${p.text}`),
    ].join("\n");
    return { content: [{ type: "text", text }], structuredContent: { services, team, digiafrika } };
  },
});
