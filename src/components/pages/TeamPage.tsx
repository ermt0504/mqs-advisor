import { useT } from "@/i18n";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { L, Reveal, Section } from "@/components/site/primitives";

// Replace with real members: { name, role, photo } once MQS_Advisor provides them.
// Photos render grayscale and turn to colour on hover.
const SLOTS = 4;

export function TeamPage() {
  const { t, paths } = useT();
  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.team.label} title={t.team.title} />
      </div>
      <Section label={t.team.label}>
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: SLOTS }).map((_, i) => (
            <Reveal as="li" key={i} delay={i * 80} className="group bg-background">
              <div className="flex aspect-square items-center justify-center border border-dashed border-line grayscale transition-[filter] duration-500 group-hover:grayscale-0">
                <span className="label-mono text-dim">{t.common.imageSlot}</span>
              </div>
              <div className="p-5">
                <div className="font-display text-lg font-semibold text-dim">{t.team.member}</div>
                <div className="label-mono mt-2 text-dim">{t.team.role}</div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Section label={t.team.joinLabel} className="pt-0 md:pt-0">
        <Reveal>
          <h2 className="h-section">{t.team.joinTitle}</h2>
          <p className="mt-6 max-w-xl font-sans text-lg text-muted-2">{t.team.joinText}</p>
          <L
            to={paths.contact}
            className="mt-10 inline-block border border-accent px-5 py-3.5 text-sm uppercase tracking-[.08em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t.team.joinCta} →
          </L>
        </Reveal>
      </Section>
      <CtaBand />
    </>
  );
}
