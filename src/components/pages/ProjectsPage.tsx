import { useState } from "react";
import { PATHS, useT } from "@/i18n";
import type { Project } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { ConfidentialBadge, CtaBand, PageHero, ProjectCard } from "@/components/site/Blocks";
import { L, Placeholder, Reveal, Section } from "@/components/site/primitives";
import saturneImg from "@/assets/project-saturne-pro.jpg";
import tcmImg from "@/assets/project-tcm.jpg";
import waahlexImg from "@/assets/project-waahlex.jpg";
import marteeImg from "@/assets/project-martee.jpg";
import transportImg from "@/assets/project-transport-quebec.jpg";
import coordinationImg from "@/assets/project-transport-coordination.jpg";

export const IMAGES: Record<string, string> = { "saturne-pro": saturneImg, "taxi-conventionne-medical": tcmImg, waahlex: waahlexImg, martee: marteeImg, "transport-usagers-quebec": transportImg };
const GALLERY_IMAGES: Record<string, string[]> = { "transport-usagers-quebec": [coordinationImg] };

const COUNTRIES = ["FR", "SN", "DJ", "CA"] as const;
const STATUSES = ["live", "wip"] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border px-3 py-2 text-xs uppercase tracking-[.1em] transition-colors",
        active ? "border-accent bg-accent text-accent-foreground" : "border-line text-muted-foreground hover:text-ink-strong",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectsPage() {
  const { t } = useT();
  const [country, setCountry] = useState<Project["country"] | null>(null);
  const [status, setStatus] = useState<Project["status"] | null>(null);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(9);
  const query = q.trim().toLowerCase();
  const list = t.projects.filter(
    (p) =>
      (!country || p.country === country) &&
      (!status || p.status === status) &&
      (!query || `${p.name} ${p.sector} ${t.countries[p.country]}`.toLowerCase().includes(query)),
  );

  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.projectsPage.label} title={t.projectsPage.title} />
      </div>
      <Section label={t.projectsPage.label} className="pt-8 md:pt-10">
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setLimit(9); }}
          placeholder={t.projectsPage.search}
          aria-label={t.projectsPage.search}
          className="field mb-6 w-full max-w-md"
        />
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:gap-12">
          <div role="group" aria-label={t.projectsPage.country} className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-2 text-dim">{t.projectsPage.country}</span>
            <Chip active={!country} onClick={() => { setCountry(null); setLimit(9); }}>{t.projectsPage.all}</Chip>
            {COUNTRIES.map((c) => (
              <Chip key={c} active={country === c} onClick={() => { setCountry(c); setLimit(9); }}>
                {t.countries[c]}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label={t.projectsPage.status} className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-2 text-dim">{t.projectsPage.status}</span>
            <Chip active={!status} onClick={() => { setStatus(null); setLimit(9); }}>{t.projectsPage.all}</Chip>
            {STATUSES.map((s) => (
              <Chip key={s} active={status === s} onClick={() => { setStatus(s); setLimit(9); }}>
                {t.status[s]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="label-mono mb-4 text-dim" aria-live="polite">{t.projectsPage.results(list.length)}</div>
        {list.length ? (
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {list.slice(0, limit).map((p) => <ProjectCard key={p.slug} p={p} image={IMAGES[p.slug]} />)}
          </div>
        ) : (
          <p className="py-10 font-sans text-muted-foreground">{t.projectsPage.empty}</p>
        )}
        {list.length > limit && (
          <button type="button" onClick={() => setLimit((l) => l + 9)} className="mt-10 border border-line px-5 py-3.5 text-sm uppercase tracking-[.08em] hover:border-accent hover:text-accent">
            {t.projectsPage.more} ({list.length - limit})
          </button>
        )}
      </Section>
      <CtaBand />
    </>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t, lang } = useT();
  const p = t.projects.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <>
      <div className="dot-grid px-5 pb-12 pt-16 md:px-14 md:pt-24">
        <Reveal>
          <L to={PATHS[lang].projects} className="label-mono text-muted-foreground hover:text-ink-strong">
            ← {t.common.back}
          </L>
          <div className="label-mono mb-8 mt-10 flex flex-wrap items-center gap-3 text-muted-foreground">
            <span className={p.status === "live" ? "pulse-dot" : "size-2 rounded-full border border-dim"} aria-hidden />
            {t.countries[p.country]}
            {p.sector && ` · ${p.sector}`} · {p.statusLabel ?? t.status[p.status]}
            {p.confidential && <ConfidentialBadge />}
          </div>
          <h1 className="max-w-[16ch] break-words font-display text-[36px] font-extrabold uppercase leading-tight sm:text-[56px] lg:text-[80px]">
            {p.name}
          </h1>
        </Reveal>
      </div>
      <Section label={t.projectsPage.detailLabel}>
        <Reveal>
          {p.confidential ? (
            <p className="max-w-2xl font-sans text-xl leading-[1.55] text-muted-2">{t.projectsPage.confidentialText}</p>
          ) : (
            <>
              <p className="max-w-2xl font-sans text-xl leading-[1.55] text-muted-2">{p.desc}</p>
              {p.note && <p className="mt-6 max-w-2xl border-l-2 border-accent pl-5 font-sans text-sm leading-relaxed text-muted-foreground">{p.note}</p>}
              {p.url && <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="mt-10 inline-block border border-accent px-5 py-3.5 text-sm uppercase tracking-[.08em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {t.common.visit} ↗
              </a>}
            </>
          )}
          {IMAGES[p.slug] && !p.confidential ? (
            <img src={IMAGES[p.slug]} alt={p.imageAlt ?? p.name} width={1600} height={900} loading="lazy" className="mt-14 aspect-[16/9] w-full object-cover" />
          ) : (
            <Placeholder className="mt-14 flex aspect-[16/9] items-center justify-center">{t.common.imageSlot}</Placeholder>
          )}
          {p.facts && (
            <dl className="mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
              {p.facts.map((f) => (
                <div key={f.label} className="border-b border-line py-6 pr-4">
                  <dd className="font-display text-4xl font-extrabold tracking-[-.04em] text-accent">{f.value}</dd>
                  <dt className="label-mono mt-2 text-muted-foreground">{f.label}</dt>
                </div>
              ))}
            </dl>
          )}
          {p.features && (
            <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2">
              {p.features.map((f, i) => (
                <div key={f.title} className="bg-background p-8">
                  <div className="label-mono text-accent">0{i + 1}</div>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase">{f.title}</h3>
                  <p className="mt-3 font-sans text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          )}
          {p.gallery?.map((item, i) => {
            const image = GALLERY_IMAGES[p.slug]?.[i];
            if (!image || p.confidential) return null;
            return <figure key={item.title} className="mt-14">
              <img src={image} alt={item.alt} width={1600} height={900} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <figcaption className="mt-6 max-w-2xl">
                <h2 className="font-display text-xl font-bold">{item.title}</h2>
                <p className="mt-3 font-sans leading-relaxed text-muted-foreground">{item.text}</p>
              </figcaption>
            </figure>;
          })}
        </Reveal>
      </Section>
      <CtaBand />
    </>
  );
}
