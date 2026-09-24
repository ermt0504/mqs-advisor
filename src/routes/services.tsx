import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { ServicesPage } from "@/components/pages/ServicesPage";

export const Route = createFileRoute("/services")({
  head: () => seo("fr", "services"),
  component: ServicesPage,
});
