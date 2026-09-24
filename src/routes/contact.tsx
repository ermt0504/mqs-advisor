import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { ContactPage } from "@/components/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => seo("fr", "contact"),
  component: ContactPage,
});
