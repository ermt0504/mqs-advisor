import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { DigiAfricaPage } from "@/components/pages/DigiAfricaPage";

export const Route = createFileRoute("/digiafrika")({
  head: () => seo("fr", "digiafrica"),
  component: DigiAfricaPage,
});
