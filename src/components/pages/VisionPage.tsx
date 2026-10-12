import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { CtaBand } from "@/components/site/Blocks";
import { Placeholder, Section } from "@/components/site/primitives";

export function VisionPage() {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset["i"]));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [t]);

  return (
    <>
      <div className="dot-grid px-5 pb-24 pt-16 md:px-14 md:pt-24">
        <div className="label-mono mb-10 flex items-center gap-3 text-accent">
          <span className="pulse-dot" aria-hidden />
          {t.vision.label}
        </div>
        <div className="flex flex-col gap-[18vh] pb-[20vh] pt-[8vh]">
          {t.vision.statements.map((s, i) => (
            <p
              key={s}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
              className={cn(
                "max-w-[18ch] font-display font-extrabold uppercase leading-[.95] tracking-[-.04em] transition-colors duration-500",
                i === active ? "text-foreground" : "text-dim",
              )}
              style={{ fontSize: "clamp(40px, 7vw, 104px)" }}
            >
              {i === 0 ? (
                <>
                  {s.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className={i === active ? "text-accent" : undefined}>{s.split(" ").slice(-1)}</span>
                </>
              ) : (
                s
              )}
            </p>
          ))}
        </div>
        {t.vision.note && <Placeholder className="max-w-xl">{t.vision.note}</Placeholder>}
      </div>
      <Section label={t.vision.meaningLabel}>
        <h2 className="h-section mb-14">{t.vision.meaningTitle}</h2>
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {t.vision.meaning.map((m) => (
            <div key={m.letter} className="bg-background p-8 md:p-10">
              <div className="font-display text-[120px] font-extrabold leading-none tracking-[-.05em] text-accent">{m.letter}</div>
              <h3 className="mt-6 font-display text-2xl font-bold uppercase">{m.word}</h3>
              <p className="mt-4 font-sans text-muted-2">{m.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
