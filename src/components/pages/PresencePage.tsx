import { useState } from "react";
import { useT } from "@/i18n";
import { Globe, type CountryCode } from "@/components/site/Globe";
import { ProjectRow } from "@/components/site/Blocks";
import { Reveal } from "@/components/site/primitives";
import { countsByCountry } from "./HomePage";

export function PresencePage() {
  const { t } = useT();
  const [sel, setSel] = useState<CountryCode | null>(null);
  const list = sel ? t.projects.filter((p) => p.country === sel) : [];

  return (
    <div className="dot-grid relative min-h-[calc(100vh-92px)] overflow-hidden">
      <div className="relative z-10 px-5 pt-16 md:px-14 md:pt-20">
        <Reveal>
          <div className="label-mono mb-8 flex items-center gap-3 text-accent">
            <span className="pulse-dot" aria-hidden />
            {t.presence.label}
          </div>
          <h1 className="h-giant max-w-[12ch]" style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
            {t.presence.title}
          </h1>
          <p className="label-mono mt-6 text-muted-foreground">{t.presence.hint}</p>
        </Reveal>
      </div>
      <div className="mx-auto -mt-4 w-[min(96vw,900px)] pb-16 md:-mt-24">
        <Globe
          labels={t.countries}
          counts={countsByCountry(t.projects)}
          countLabel={t.common.projectsCount}
          onSelect={setSel}
          selected={sel}
          ariaLabel={t.meta.presence.description}
        />
      </div>

      <section className="relative z-10 border-t border-line bg-background/80 px-5 py-20 md:px-14">
        <Reveal>
          <div className="label-mono mb-8 text-accent">{t.presence.africa.label}</div>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="h-section max-w-[18ch]">{t.presence.africa.title}</h2>
              <p className="mt-6 max-w-[60ch] font-sans text-muted-foreground">{t.presence.africa.text}</p>
              <a
                href={t.presence.africa.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono mt-8 inline-block border border-accent px-4 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {t.presence.africa.cta} ↗
              </a>
            </div>
            <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-3 lg:grid-cols-1">
              {t.presence.africa.facts.map((f) => (
                <div key={f.label} className="border-b border-line py-6">
                  <dt className="label-mono text-muted-foreground">{f.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-extrabold tracking-[-.04em]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <aside
        aria-live="polite"
        aria-hidden={!sel}
        className={
          "fixed inset-y-0 right-0 z-[60] w-full max-w-[460px] overflow-y-auto border-l border-line bg-background/95 px-6 py-8 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] md:px-10 " +
          (sel ? "translate-x-0" : "pointer-events-none translate-x-full")
        }
      >
        {sel && (
          <>
            <div className="flex items-center justify-between">
              <span className="label-mono text-accent">
                [{sel}] {sel === "CA" ? t.presence.hq : t.common.projectsCount(list.length)}
              </span>
              <button
                type="button"
                onClick={() => setSel(null)}
                className="label-mono border border-line px-3 py-2 hover:text-ink-strong"
              >
                {t.nav.close}
              </button>
            </div>
            <h2 className="mt-8 font-display text-4xl font-extrabold uppercase tracking-[-.04em]">{t.countries[sel]}</h2>
            <div className="mt-8 border-t border-line">
              {list.length ? list.map((p) => <ProjectRow key={p.slug} p={p} />) : (
                <p className="py-6 font-sans text-muted-foreground">{t.presence.panelEmpty}</p>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
