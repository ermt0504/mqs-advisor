import { projectPath, useT } from "@/i18n";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { L, Placeholder, Reveal, Section } from "@/components/site/primitives";

export function ServicesPage() {
  const { t, lang } = useT();
  return (
    <>
      <div className="dot-grid">
        <PageHero label={t.services.label} title={t.services.title} />
      </div>
      <Section label={t.services.label}>
        <div className="border-t border-line">
          {t.services.items.map((s, i) => (
            <Reveal key={s.title} className="grid gap-8 border-b border-line py-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="font-display text-[48px] font-extrabold leading-none text-ghost">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-.02em] text-ink-strong md:text-[34px]">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-xl font-sans text-lg leading-[1.55] text-muted-2">{s.text}</p>
              </div>
              <div className="grid content-start gap-8">
                <div>
                  <div className="label-mono mb-3 text-accent">{t.services.deliverables}</div>
                  <ul className="border-t border-line">
                    {s.deliverables.map((d) => (
                      <li key={d} className="border-b border-line py-3 font-sans text-[15px] text-muted-2">
                        <span className="mr-3 text-accent">→</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label-mono mb-3 text-accent">{t.services.related}</div>
                  {s.related.length ? (
                    <ul className="border-t border-line">
                      {s.related.map((slug) => {
                        const p = t.projects.find((x) => x.slug === slug);
                        if (!p) return null;
                        return (
                          <li key={slug} className="border-b border-line">
                            <L
                              to={projectPath(lang, slug)}
                              className="flex justify-between py-3 text-sm transition-all hover:pl-2 hover:text-ink-strong"
                            >
                              {p.name} <span aria-hidden>↗</span>
                            </L>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Placeholder>{t.common.toProvide}</Placeholder>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
