import { createFileRoute, notFound } from "@tanstack/react-router";
import { DICTS, seo } from "@/i18n";
import { ProjectDetailPage } from "@/components/pages/ProjectsPage";

export const Route = createFileRoute("/en/projects/$slug")({
  loader: ({ params }) => {
    const p = DICTS.en.projects.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name, desc: p.desc || DICTS.en.projectsPage.confidentialText };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "MQS_Advisor" }, { name: "robots", content: "noindex" }] };
    return seo("en", "projects", { title: `${loaderData.name} — MQS_Advisor`, description: loaderData.desc, slug: params.slug });
  },
  component: Detail,
});

function Detail() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
