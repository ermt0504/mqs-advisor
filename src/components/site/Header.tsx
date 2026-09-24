import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { switchPath, useT, type NavKey } from "@/i18n";
import { cn } from "@/lib/utils";
import { L } from "./primitives";

const NAV: NavKey[] = ["vision", "services", "incubator", "projects", "presence", "team"];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-extrabold tracking-normal normal-case", className)}>
      MQS<span className="text-accent">_</span>Advisor
    </span>
  );
}

export function LangToggle() {
  const { lang } = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <span className="label-mono tracking-[.08em]">
      <L
        to={switchPath(pathname, "fr")}
        hrefLang="fr"
        className={lang === "fr" ? "text-ink-strong" : "text-dim hover:text-ink-strong"}
      >
        FR
      </L>{" "}
      <span className="text-dim">/</span>{" "}
      <L
        to={switchPath(pathname, "en")}
        hrefLang="en"
        className={lang === "en" ? "text-ink-strong" : "text-dim hover:text-ink-strong"}
      >
        EN
      </L>
    </span>
  );
}

export function Header() {
  const { t, paths } = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-background/75 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <a
        href="#main"
        className="label-mono sr-only bg-accent px-3 py-2 text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {t.nav.skip}
      </a>
      <div className="flex items-center justify-between px-5 py-5 text-xs uppercase tracking-[.08em] md:px-14 md:py-7">
        <L to={paths.home} className="text-[17px]" aria-current={pathname === paths.home ? "page" : undefined}>
          <Logo />
        </L>
        <nav className="hidden gap-7 text-muted-foreground lg:flex xl:gap-9" aria-label="Principal">
          {NAV.map((k) => {
            const active = pathname.startsWith(paths[k]);
            return (
              <L
                key={k}
                to={paths[k]}
                aria-current={active ? "page" : undefined}
                className={cn("transition-colors hover:text-ink-strong", active && "text-ink-strong")}
              >
                {t.nav[k]}
              </L>
            );
          })}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <LangToggle />
          <L
            to={paths.contact}
            className="border border-accent px-4 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t.nav.submit}
          </L>
        </div>
        <button
          type="button"
          className="label-mono border border-line px-3 py-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line px-5 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {[...NAV, "contact" as NavKey].map((k) => (
              <li key={k} className="border-b border-line">
                <L to={paths[k]} className="block py-4 font-display text-2xl font-semibold">
                  {t.nav[k]}
                </L>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <LangToggle />
            <L to={paths.contact} className="label-mono border border-accent px-4 py-2.5 text-accent">
              {t.nav.submit}
            </L>
          </div>
        </nav>
      )}
    </header>
  );
}
