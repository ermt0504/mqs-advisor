import { createFileRoute, notFound } from "@tanstack/react-router";
import { DICTS, seo } from "@/i18n";
import { ProjectDetailPage } from "@/components/pages/ProjectsPage";

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ params }) => {
    const p = DICTS.fr.projects.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name, desc: p.desc || DICTS.fr.projectsPage.confidentialText };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "MQS_Advisor" }, { name: "robots", content: "noindex" }] };
    return seo("fr", "projects", { title: `${loaderData.name} — MQS_Advisor`, description: loaderData.desc, slug: params.slug });
  },
  component: Detail,
});

function Detail() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
