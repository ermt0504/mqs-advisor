import { projectPath, useT } from "@/i18n";
import type { Project } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { L, Reveal } from "./primitives";

export function Pipeline() {
  const { t } = useT();
  return (
    <ol className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {t.steps.map((s, i) => (
        <Reveal
          as="li"
          key={s.title}
          delay={i * 80}
          className={cn(
            "border-b border-line px-0 py-7 transition-colors hover:bg-muted sm:px-6 lg:border-b-0",
            i < 3 && "lg:border-r",
            i % 2 === 0 && "sm:border-r",
            i === 0 && "sm:pl-0",
          )}
        >
          <div className={cn("font-display text-[64px] font-extrabold leading-none", i === 3 ? "text-accent" : "text-ghost")}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="mb-2.5 mt-[18px] text-[15px] text-ink-strong">{s.title}</div>
          <p className="font-sans text-[15px] leading-normal text-muted-foreground">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function ConfidentialBadge() {
  const { t } = useT();
  return (
    <span className="inline-flex items-center gap-1.5 border border-accent px-2 py-1 text-[10px] uppercase tracking-[.14em] text-accent">
      <span aria-hidden>■</span> {t.projectsPage.confidentialBadge}
    </span>
  );
}

export function ProjectRow({ p }: { p: Project }) {
  const { t, lang } = useT();
  return (
    <L
      to={projectPath(lang, p.slug)}
      className="grid gap-3 border-b border-line py-8 transition-all duration-300 hover:bg-muted hover:pl-4 md:grid-cols-[1fr_200px_120px_40px] md:items-center md:gap-0"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-2xl font-semibold tracking-[-.02em] md:text-[34px]">{p.name}</span>
          {p.confidential && <ConfidentialBadge />}
        </div>
        <div className="mt-2 font-sans text-[15px] text-muted-foreground">{p.confidential ? t.projectsPage.confidentialText : p.desc}</div>
      </div>
      <div className="text-xs uppercase tracking-[.1em] text-muted-foreground">
        {t.countries[p.country]}{p.sector && ` · ${p.sector}`}
      </div>
      <div className={cn("text-xs uppercase", p.status === "live" ? "text-accent" : "text-muted-foreground")}>{p.status === "live" ? "●" : "○"} {t.status[p.status]}</div>
      <div className="text-[22px]" aria-hidden>↗</div>
    </L>
  );
}

export function ProjectCard({ p, image }: { p: Project; image?: string | undefined }) {
  const { t, lang } = useT();
  return (
    <L to={projectPath(lang, p.slug)} className="group flex flex-col bg-background transition-colors hover:bg-muted">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {image && !p.confidential ? (
          <img src={image} alt={p.imageAlt ?? p.name} loading="lazy" className="size-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
        ) : (
          <div className="dot-grid flex size-full items-center justify-center">
            <span className="font-display text-6xl font-extrabold text-ghost">{p.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        {p.confidential && <div className="absolute left-4 top-4 bg-background"><ConfidentialBadge /></div>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="label-mono flex flex-wrap items-center justify-between gap-3 text-muted-foreground">
          <span>{t.countries[p.country]}{p.sector && ` · ${p.sector}`}</span>
          <span className={p.status === "live" ? "text-accent" : ""}>{p.status === "live" ? "●" : "○"} {p.statusLabel ?? t.status[p.status]}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold tracking-[-.02em]">{p.name}</h3>
        <p className="mt-3 line-clamp-3 font-sans text-[15px] text-muted-foreground">{p.confidential ? t.projectsPage.confidentialText : p.desc}</p>
        <span className="mt-auto pt-6 text-sm uppercase tracking-[.08em] text-ink-strong group-hover:text-accent">↗</span>
      </div>
    </L>
  );
}

export function CtaBand() {
  const { t, paths } = useT();
  return (
    <section className="flex flex-col items-start justify-between gap-10 bg-accent px-5 py-20 text-accent-foreground md:flex-row md:items-end md:px-14 md:py-[100px]">
      <h2
        className="font-display font-extrabold uppercase leading-[.95] tracking-[-.04em]"
        style={{ fontSize: "clamp(44px, 6.6vw, 84px)" }}
      >
        {t.home.ctaTitleA}
        <br />
        {t.home.ctaTitleB}
      </h2>
      <L
        to={paths.contact}
        className="whitespace-nowrap bg-background px-[30px] py-[22px] text-sm uppercase tracking-[.08em] text-ink-strong transition-colors hover:bg-secondary focus-visible:outline-background"
      >
        {t.nav.submit} →
      </L>
    </section>
  );
}

export function PageHero({ label, title }: { label: string; title: string }) {
  return (
    <div className="px-5 pb-12 pt-16 md:px-14 md:pb-16 md:pt-24">
      <Reveal>
        <div className="label-mono mb-8 flex items-center gap-3 text-muted-foreground">
          <span className="pulse-dot" aria-hidden />
          {label}
        </div>
        <h1 className="h-giant max-w-[14ch]">{title}</h1>
      </Reveal>
    </div>
  );
}
