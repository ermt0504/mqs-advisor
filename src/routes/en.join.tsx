import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { JoinPage } from "@/components/pages/JoinPage";

export const Route = createFileRoute("/en/join")({
  head: () => seo("en", "join"),
  component: JoinPage,
});
