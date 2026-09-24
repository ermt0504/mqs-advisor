import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { ContactPage } from "@/components/pages/ContactPage";

export const Route = createFileRoute("/en/contact")({
  head: () => seo("en", "contact"),
  component: ContactPage,
});
