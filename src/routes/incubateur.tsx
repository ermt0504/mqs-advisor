import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { IncubatorPage } from "@/components/pages/IncubatorPage";

export const Route = createFileRoute("/incubateur")({
  head: () => seo("fr", "incubator"),
  component: IncubatorPage,
});
