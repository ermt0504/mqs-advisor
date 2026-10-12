import { useState } from "react";
import { PATHS, useT } from "@/i18n";
import type { Project } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { CtaBand, PageHero, ProjectRow } from "@/components/site/Blocks";
import { L, Placeholder, Reveal, Section } from "@/components/site/primitives";
import saturneImg from "@/assets/project-saturne-pro.jpg";
import tcmImg from "@/assets/project-tcm.jpg";
import waahlexImg from "@/assets/project-waahlex.jpg";

const IMAGES: Record<string, string> = { "saturne-pro": saturneImg, "taxi-conventionne-medical": tcmImg, waahlex: waahlexImg };

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
  const list = t.projects.filter((p) => (!country || p.country === country) && (!status || p.status === status));

  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.projectsPage.label} title={t.projectsPage.title} />
      </div>
      <Section label={t.projectsPage.label} className="pt-8 md:pt-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:gap-12">
          <div role="group" aria-label={t.projectsPage.country} className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-2 text-dim">{t.projectsPage.country}</span>
            <Chip active={!country} onClick={() => setCountry(null)}>{t.projectsPage.all}</Chip>
            {COUNTRIES.map((c) => (
              <Chip key={c} active={country === c} onClick={() => setCountry(c)}>
                {t.countries[c]}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label={t.projectsPage.status} className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-2 text-dim">{t.projectsPage.status}</span>
            <Chip active={!status} onClick={() => setStatus(null)}>{t.projectsPage.all}</Chip>
            {STATUSES.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {t.status[s]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="border-t border-line" aria-live="polite">
          {list.length ? list.map((p) => <ProjectRow key={p.slug} p={p} />) : (
            <p className="py-10 font-sans text-muted-foreground">{t.projectsPage.empty}</p>
          )}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t, lang } = useT();
  const p = t.projects.find((x) => x.slug === slug)!;
  return (
    <>
      <div className="dot-grid px-5 pb-12 pt-16 md:px-14 md:pt-24">
        <Reveal>
          <L to={PATHS[lang].projects} className="label-mono text-muted-foreground hover:text-ink-strong">
            ← {t.common.back}
          </L>
          <div className="label-mono mb-8 mt-10 flex items-center gap-3 text-muted-foreground">
            <span className={p.status === "live" ? "pulse-dot" : "size-2 rounded-full border border-dim"} aria-hidden />
            {t.countries[p.country]}
            {p.sector && ` · ${p.sector}`} · {t.status[p.status]}
          </div>
          <h1 className={cn("h-giant max-w-[16ch]", p.confidential && "text-dim")} style={{ fontSize: "clamp(44px, 8vw, 112px)" }}>
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
          {IMAGES[p.slug] ? (
            <img src={IMAGES[p.slug]} alt={p.name} width={1600} height={912} loading="lazy" className="mt-14 aspect-[16/9] w-full object-cover" />
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
        </Reveal>
      </Section>
      <CtaBand />
    </>
  );
}
