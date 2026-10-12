import { useT } from "@/i18n";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { L, Reveal, Section } from "@/components/site/primitives";
import ceo from "@/assets/team-ceo.jpg";
import cto from "@/assets/team-cto.jpg";
import legal from "@/assets/team-legal.jpg";

// Temporary AI portraits — replace with real photos (same file names).
const PHOTOS: Record<string, string> = { ceo, cto, legal };

export function TeamPage() {
  const { t, paths } = useT();
  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.team.label} title={t.team.title} />
      </div>
      <Section label={t.team.label}>
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.team.members.map((m, i) => (
            <Reveal as="li" key={m.key} delay={i * 80} className="group bg-background">
              <div className="aspect-square overflow-hidden">
                <img
                  src={PHOTOS[m.key]}
                  alt={`${m.role} — ${m.origin}`}
                  width={816}
                  height={816}
                  loading="lazy"
                  className="size-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
              <div className="p-5">
                <div className="font-display text-lg font-semibold text-ink-strong">{m.name}</div>
                <div className="label-mono mt-2 text-accent">{m.role}</div>
                <div className="label-mono mt-1 text-dim">{m.origin}</div>
                <p className="mt-4 font-sans text-[15px] leading-normal text-muted-foreground">{m.bio}</p>
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
            to={paths.join}
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
