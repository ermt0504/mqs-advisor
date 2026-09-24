import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { TeamPage } from "@/components/pages/TeamPage";

export const Route = createFileRoute("/en/team")({
  head: () => seo("en", "team"),
  component: TeamPage,
});
