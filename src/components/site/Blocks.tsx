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

export function ProjectRow({ p }: { p: Project }) {
  const { t, lang } = useT();
  const cols = "grid gap-3 py-8 md:grid-cols-[1fr_200px_120px_40px] md:items-center md:gap-0";
  if (p.confidential) {
    return (
      <div className={cn(cols, "border-b border-line text-dim")}>
        <div className="font-display text-2xl font-semibold tracking-[-.02em] md:text-[34px]">{p.name}</div>
        <div className="text-xs uppercase tracking-[.1em]">{t.countries[p.country]}</div>
        <div className="text-xs uppercase">○ {t.status.wip}</div>
        <div />
      </div>
    );
  }
  return (
    <L
      to={projectPath(lang, p.slug)}
      className={cn(cols, "border-b border-line transition-all duration-300 hover:bg-muted hover:pl-4")}
    >
      <div>
        <div className="font-display text-2xl font-semibold tracking-[-.02em] md:text-[34px]">{p.name}</div>
        <div className="mt-2 font-sans text-[15px] text-muted-foreground">{p.desc}</div>
      </div>
      <div className="text-xs uppercase tracking-[.1em] text-muted-foreground">
        {t.countries[p.country]} · {p.sector}
      </div>
      <div className="text-xs uppercase text-accent">● {t.status[p.status]}</div>
      <div className="text-[22px]" aria-hidden>
        ↗
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
