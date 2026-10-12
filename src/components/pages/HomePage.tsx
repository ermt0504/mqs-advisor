import { useRef } from "react";
import { useT } from "@/i18n";
import { Globe, type CountryCode } from "@/components/site/Globe";
import { CtaBand, Pipeline, ProjectCard }
import { IMAGES } from "@/components/pages/ProjectsPage"; from "@/components/site/Blocks";
import { Counter, Reveal, Section } from "@/components/site/primitives";
import { IdeaAdvisor } from "@/components/site/IdeaAdvisor";

export function countsByCountry(projects: { country: CountryCode }[]) {
  const c: Record<CountryCode, number> = { CA: 0, FR: 0, SN: 0, DJ: 0 };
  projects.forEach((p) => c[p.country]++);
  return c;
}

export function HomePage() {
  const { t } = useT();
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !heroRef.current || !glowRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    glowRef.current.style.background = `radial-gradient(420px circle at ${x}% ${y}%, oklch(0.86 0.19 128 / .22), transparent 70%)`;
  };

  return (
    <>
      <div ref={heroRef} onPointerMove={onMove} className="dot-grid relative -mt-[76px] overflow-hidden pt-[76px] md:-mt-[92px] md:pt-[92px]">
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(420px circle at 70% 40%, oklch(0.86 0.19 128 / .22), transparent 70%)" }}
        />
        <div className="relative mx-auto w-[90%] pt-6 md:absolute md:right-[-40px] md:top-[70px] md:w-[min(640px,55vw)] md:pt-0">
          <Globe
            labels={t.countries}
            counts={countsByCountry(t.projects)}
            countLabel={t.common.projectsCount}
            ariaLabel={t.meta.presence.description}
          />
        </div>
        <div className="pointer-events-none relative px-5 pb-10 pt-10 md:px-14 md:pt-[90px]">
          <Reveal>
            <div className="label-mono pointer-events-auto mb-9 flex items-center gap-3 text-muted-foreground">
              <span className="pulse-dot" aria-hidden />
              {t.home.status}
            </div>
            <h1 className="h-giant">
              {t.home.h1a}
              <br />
              {t.home.h1b}
              <br />
              <span className="text-accent">{t.home.h1c}</span>.
            </h1>
          </Reveal>
          <div className="pointer-events-auto mt-16 grid items-end gap-10 md:grid-cols-2 md:gap-14">
            <Reveal delay={100}>
              <p className="max-w-[520px] text-pretty font-sans text-lg leading-[1.55] text-muted-2 md:text-xl">
                {t.home.intro}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="flex flex-wrap gap-8 text-xs tracking-[.1em] text-muted-foreground md:justify-end md:gap-12">
                {t.home.codes.map((c) => (
                  <div key={c.code}>
                    <div className="text-[13px] text-ink-strong">{c.code}</div>
                    {c.label}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
        <div className="relative mx-5 mt-12 h-px bg-line md:mx-14" />
      </div>

      <Section label={t.home.modelLabel}>
        <Reveal>
          <h2 className="h-section mb-16">{t.home.modelTitle}</h2>
        </Reveal>
        <Pipeline />
      </Section>

      <Section label={t.home.figuresLabel} className="pt-0 md:pt-0">
        <div className="grid border-t border-line sm:grid-cols-3">
          {t.home.figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 80} className="border-b border-line py-8 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
              <div className="font-display text-[72px] font-extrabold leading-none tracking-[-.04em] text-ink-strong md:text-[96px]">
                <Counter value={f.value} />
              </div>
              <div className="label-mono mt-4 text-muted-foreground">{f.label}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label={t.home.portfolioLabel} className="pt-0 md:pt-0">
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.projects.slice(0, 6).map((p) => (
            <ProjectCard key={p.slug} p={p} image={IMAGES[p.slug]} />
          ))}
        </div>
        <L to={paths.projects} className="mt-10 inline-block border border-accent px-5 py-3.5 text-sm uppercase tracking-[.08em] text-accent hover:bg-accent hover:text-accent-foreground">
          {t.projectsPage.viewAll} ({t.projects.length}) →
        </L>
      </Section>

      <IdeaAdvisor />

      <CtaBand />
    </>
  );
}
