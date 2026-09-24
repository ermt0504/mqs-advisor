import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { VisionPage } from "@/components/pages/VisionPage";

export const Route = createFileRoute("/en/vision")({
  head: () => seo("en", "vision"),
  component: VisionPage,
});
