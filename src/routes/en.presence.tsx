import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { PresencePage } from "@/components/pages/PresencePage";

export const Route = createFileRoute("/en/presence")({
  head: () => seo("en", "presence"),
  component: PresencePage,
});
