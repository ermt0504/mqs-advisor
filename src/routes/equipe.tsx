import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { TeamPage } from "@/components/pages/TeamPage";

export const Route = createFileRoute("/equipe")({
  head: () => seo("fr", "team"),
  component: TeamPage,
});
