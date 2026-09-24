import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { CtaBand } from "@/components/site/Blocks";
import { Placeholder } from "@/components/site/primitives";

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
      <CtaBand />
    </>
  );
}
