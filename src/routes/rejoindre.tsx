import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { JoinPage } from "@/components/pages/JoinPage";

export const Route = createFileRoute("/rejoindre")({
  head: () => seo("fr", "join"),
  component: JoinPage,
});
