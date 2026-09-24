import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { PresencePage } from "@/components/pages/PresencePage";

export const Route = createFileRoute("/presence")({
  head: () => seo("fr", "presence"),
  component: PresencePage,
});
