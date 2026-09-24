import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/i18n";
import { ProjectsPage } from "@/components/pages/ProjectsPage";

export const Route = createFileRoute("/en/projects/")({
  head: () => seo("en", "projects"),
  component: ProjectsPage,
});
