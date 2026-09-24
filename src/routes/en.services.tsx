import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { ServicesPage } from "@/components/pages/ServicesPage";

export const Route = createFileRoute("/en/services")({
  head: () => seo("en", "services"),
  component: ServicesPage,
});
