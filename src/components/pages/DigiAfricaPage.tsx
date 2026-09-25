import { useT } from "@/i18n";
import { PageHero } from "@/components/site/Blocks";
import { L, Reveal, Section } from "@/components/site/primitives";

export function DigiAfricaPage() {
  const { t, paths } = useT();
  const d = t.digiafrica;
  return (
    <>
      <PageHero label={d.label} title={d.title} />
      <div className="px-5 pb-16 md:px-14">
        <p className="max-w-[60ch] font-sans text-lg text-muted-2">{d.intro}</p>
        <a href={t.presence.africa.url} target="_blank" rel="noopener noreferrer" className="label-mono mt-8 inline-block border border-accent px-4 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground">
          {t.presence.africa.cta} ↗
        </a>
      </div>

      <Section label={d.goalsLabel}>
        <div className="grid gap-px bg-line sm:grid-cols-2">
          {d.goals.map((g, i) => (
            <Reveal key={g.title} delay={i * 60} className="bg-background p-8">
              <div className="font-display text-4xl font-extrabold text-ghost">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="mt-4 text-lg text-ink-strong">{g.title}</h2>
              <p className="mt-2 font-sans text-[15px] text-muted-foreground">{g.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label={d.projectsLabel}>
        <div className="border-t border-line">
          {d.projects.map((p) => (
            <Reveal key={p.title} className="grid gap-3 border-b border-line py-8 md:grid-cols-[1fr_160px_120px] md:items-center">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-[-.02em]">{p.title}</h3>
                <p className="mt-2 font-sans text-[15px] text-muted-foreground">{p.text}</p>
              </div>
              <div className="text-xs uppercase tracking-[.1em] text-muted-foreground">{t.countries[p.country as "SN" | "DJ"]}</div>
              <div className="label-mono flex items-center gap-2 text-accent"><span className="pulse-dot" aria-hidden />{t.status.wip}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label={d.factsLabel}>
        <dl className="grid border-t border-line sm:grid-cols-3">
          {t.presence.africa.facts.map((f) => (
            <div key={f.label} className="border-b border-line py-6 sm:pr-6">
              <dt className="label-mono text-muted-foreground">{f.label}</dt>
              <dd className="mt-2 font-display text-5xl font-extrabold tracking-[-.04em]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label={d.quoteLabel}>
        <Reveal>
          <figure className="border-l-2 border-accent pl-8">
            <blockquote className="font-display text-2xl font-semibold leading-snug tracking-[-.02em] text-ink-strong md:text-4xl">« {d.quote} »</blockquote>
            <figcaption className="label-mono mt-6 text-muted-foreground">— {d.quoteAuthor}</figcaption>
          </figure>
        </Reveal>
      </Section>

      <section className="flex flex-col items-start justify-between gap-8 bg-accent px-5 py-20 text-accent-foreground md:flex-row md:items-end md:px-14">
        <div>
          <h2 className="font-display text-4xl font-extrabold uppercase tracking-[-.04em] md:text-6xl">{d.ctaTitle}</h2>
          <p className="mt-4 font-sans text-lg">{d.ctaText}</p>
        </div>
        <L to={paths.contact} className="whitespace-nowrap bg-background px-[30px] py-[22px] text-sm uppercase tracking-[.08em] text-ink-strong hover:bg-secondary">
          {t.nav.contact} →
        </L>
      </section>
    </>
  );
}
