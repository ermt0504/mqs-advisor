import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { DigiAfricaPage } from "@/components/pages/DigiAfricaPage";

export const Route = createFileRoute("/en/digiafrika")({
  head: () => seo("en", "digiafrica"),
  component: DigiAfricaPage,
});
