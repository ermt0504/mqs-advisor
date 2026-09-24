import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { VisionPage } from "@/components/pages/VisionPage";

export const Route = createFileRoute("/vision")({
  head: () => seo("fr", "vision"),
  component: VisionPage,
});
