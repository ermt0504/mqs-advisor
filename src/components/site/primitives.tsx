import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Internal link that accepts runtime-computed localized paths. */
export function L({
  to,
  className,
  children,
  onClick,
  ...rest
}: {
  to: string;
  className?: string | undefined;
  children: ReactNode;
  onClick?: (() => void) | undefined;
  "aria-current"?: "page" | undefined;
  hrefLang?: string | undefined;
}) {
  return (
    // Paths come from the typed PATHS map in src/i18n; all of them exist as route files.
    <Link to={to as "/"} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};
  return (
    <Tag ref={ref as never} className={cn("reveal", inView && "is-in", className)} style={style}>
      {children}
    </Tag>
  );
}

/** Section with the `[0X] Label` left column (260px) and content on the right. */
export function Section({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-8 px-5 py-20 md:grid-cols-[200px_1fr] md:gap-14 md:px-14 md:py-[120px] lg:grid-cols-[260px_1fr]",
        className,
      )}
    >
      <Reveal>
        <div className="label-mono text-accent">{label}</div>
      </Reveal>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function Placeholder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border border-dashed border-line p-4 font-sans text-[15px] text-dim", className)}>
      {children}
    </div>
  );
}

export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1200;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} aria-label={String(value)}>
      {String(n).padStart(2, "0")}
    </span>
  );
}
