import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { HomePage } from "@/components/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => seo("fr", "home"),
  component: HomePage,
});
