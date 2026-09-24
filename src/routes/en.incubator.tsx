import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { IncubatorPage } from "@/components/pages/IncubatorPage";

export const Route = createFileRoute("/en/incubator")({
  head: () => seo("en", "incubator"),
  component: IncubatorPage,
});
