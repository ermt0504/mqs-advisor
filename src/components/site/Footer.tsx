import { useT, type NavKey } from "@/i18n";
import { L } from "./primitives";
import { LangToggle } from "./Header";

const LINKS: NavKey[] = ["vision", "services", "incubator", "projects", "presence", "team", "contact"];

export function Footer() {
  const { t, paths } = useT();
  return (
    <footer className="border-t border-line px-5 pb-10 pt-16 md:px-14">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs uppercase tracking-[.08em] text-muted-foreground sm:grid-cols-4">
            {LINKS.map((k) => (
              <li key={k}>
                <L to={paths[k]} className="hover:text-ink-strong">
                  {t.nav[k]}
                </L>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap gap-8 text-xs tracking-[.1em] text-muted-foreground">
          {(["CA", "FR", "SN", "DJ"] as const).map((c) => (
            <div key={c}>
              <div className="text-[13px] text-ink-strong">{c}</div>
              {t.countries[c]}
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="mt-16 select-none whitespace-nowrap font-display font-extrabold leading-[.85] tracking-[-.05em]"
        style={{ fontSize: "clamp(40px, 13.2vw, 176px)" }}
      >
        MQS<span className="text-accent">_</span>Advisor
      </div>
      <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line pt-6 text-xs uppercase tracking-[.08em] text-dim sm:flex-row sm:items-center">
        <span>
          © {new Date().getFullYear()} MQS_Advisor. {t.footer.rights}
        </span>
        <span title={t.footer.legalText}>
          {t.footer.legal} · {t.common.toProvide}
        </span>
        <LangToggle />
      </div>
    </footer>
  );
}
