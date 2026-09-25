import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/i18n";
import { recommendWebsite } from "@/lib/advisor.functions";
import { L, Reveal, Section } from "./primitives";

type Result = Awaited<ReturnType<typeof recommendWebsite>>;

export function IdeaAdvisor() {
  const { t, lang, paths } = useT();
  const a = t.advisor;
  const run = useServerFn(recommendWebsite);
  const [idea, setIdea] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [res, setRes] = useState<Result | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (idea.trim().length < 10 || state === "loading") return;
    setState("loading");
    setRes(null);
    try {
      setRes(await run({ data: { idea, lang } }));
      setState("idle");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  const Examples = ({ title, items }: { title: string; items: { name: string; example: string }[] }) => (
    <div className="bg-background p-6">
      <div className="label-mono text-accent">{title}</div>
      <ul className="mt-4 space-y-4 font-sans text-[15px]">
        {items.map((x) => (
          <li key={x.name}>
            <div className="text-ink-strong">→ {x.name}</div>
            <p className="mt-1 pl-4 text-muted-foreground"><span className="text-dim">{a.example} : </span>{x.example}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Section label={a.label} className="pt-0 md:pt-0">
      <Reveal>
        <h2 className="h-section">{a.title}</h2>
        <p className="mt-6 max-w-xl font-sans text-lg text-muted-2">{a.text}</p>
      </Reveal>
      <form onSubmit={onSubmit} className="mt-10 max-w-3xl">
        <label htmlFor="idea" className="label-mono block text-muted-foreground">{a.field}</label>
        <textarea id="idea" rows={4} maxLength={2000} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder={a.placeholder} className="field resize-y" />
        <button type="submit" disabled={state === "loading" || idea.trim().length < 10} className="mt-6 bg-accent px-[30px] py-[20px] text-sm uppercase tracking-[.08em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
          {state === "loading" ? a.loading : a.submit} →
        </button>
        {state === "error" && <p role="alert" className="mt-4 text-sm text-destructive">{a.error}</p>}
      </form>
      {res && (
        <div className="mt-12 grid gap-px bg-line md:grid-cols-2" aria-live="polite">
          <div className="bg-background p-6 md:col-span-2">
            <div className="label-mono text-accent">{a.summary}</div>
            <p className="mt-4 font-sans text-lg text-ink-strong">{res.summary}</p>
            <p className="mt-3 font-sans text-[15px] text-muted-foreground"><span className="text-dim">{a.audience} — </span>{res.audience}</p>
          </div>
          <Examples title={a.pages} items={res.pages} />
          <Examples title={a.features} items={res.features} />
          <div className="bg-background p-6">
            <div className="label-mono text-accent">{a.design}</div>
            <p className="mt-4 font-sans text-[15px] text-muted-foreground">{res.design}</p>
          </div>
          <div className="bg-background p-6">
            <div className="label-mono text-accent">{a.next}</div>
            <ul className="mt-4 space-y-2 font-sans text-[15px] text-muted-foreground">
              {res.nextSteps.map((x) => <li key={x}>→ {x}</li>)}
            </ul>
          </div>
          {res.links.length > 0 && (
            <div className="bg-background p-6 md:col-span-2">
              <div className="label-mono text-accent">{a.links}</div>
              <div className="mt-4 grid gap-px bg-line sm:grid-cols-3">
                {res.links.map((l) => (
                  <L key={l.page} to={paths[l.page]} className="group bg-background p-5 transition-colors hover:bg-muted">
                    <div className="text-ink-strong group-hover:text-accent">{t.nav[l.page]} →</div>
                    <p className="mt-2 font-sans text-sm text-muted-foreground">{l.reason}</p>
                  </L>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
