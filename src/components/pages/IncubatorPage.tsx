import { useT } from "@/i18n";
import { CtaBand, PageHero, Pipeline } from "@/components/site/Blocks";
import { Placeholder, Reveal, Section } from "@/components/site/primitives";

export function IncubatorPage() {
  const { t } = useT();
  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.incubator.label} title={t.incubator.title} />
      </div>
      <Section label={t.home.modelLabel}>
        <Reveal>
          <h2 className="h-section mb-16">{t.home.modelTitle}</h2>
        </Reveal>
        <Pipeline />
      </Section>
      <Section label={t.incubator.detailsLabel} className="pt-0 md:pt-0">
        <div className="grid border-t border-line md:grid-cols-2">
          {t.incubator.details.map((d, i) => (
            <Reveal
              key={d.title}
              delay={i * 80}
              className="border-b border-line py-10 md:px-8 md:odd:border-r md:odd:pl-0"
            >
              <h3 className="font-display text-2xl font-semibold tracking-[-.02em] text-ink-strong">{d.title}</h3>
              <Placeholder className="mt-5">{t.common.toProvideBy}</Placeholder>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
