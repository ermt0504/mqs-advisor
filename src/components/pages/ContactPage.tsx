import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/Blocks";
import { Section } from "@/components/site/primitives";

type Tab = "contact" | "project";
type Errs = Partial<Record<"name" | "email" | "message" | "project_name" | "attachment", string>>;
const MAX = 10 * 1024 * 1024;

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string | undefined; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ContactPage() {
  const { t, lang } = useT();
  const c = t.contact;
  const [tab, setTab] = useState<Tab>(() =>
    typeof window !== "undefined" && window.location.hash === "#general" ? "contact" : "project",
  );
  const [errors, setErrors] = useState<Errs>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "").trim();
    const schema = z.object({
      name: z.string().min(1, c.required).max(200),
      email: z.string().email(c.invalidEmail).max(255),
      message: z.string().min(1, c.required).max(5000),
    });
    const res = schema.safeParse({ name: s("name"), email: s("email"), message: s("message") });
    const errs: Errs = {};
    if (!res.success) res.error.issues.forEach((i) => (errs[i.path[0] as keyof Errs] = i.message));
    if (tab === "project" && !s("project_name")) errs.project_name = c.required;
    const file = fd.get("attachment");
    const hasFile = file instanceof File && file.size > 0;
    if (hasFile && file.size > MAX) errs.attachment = c.fileTooBig;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      let attachment_path: string | null = null;
      if (tab === "project" && hasFile) {
        const ext = file.name.split(".").pop()?.slice(0, 8) ?? "bin";
        const path = `${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        attachment_path = path;
      }
      const opt = (k: string) => (tab === "project" ? s(k).slice(0, 500) || null : null);
      const { error } = await supabase.from("submissions").insert({
        kind: tab,
        lang,
        name: s("name"),
        email: s("email"),
        organisation: s("organisation") || null,
        message: s("message"),
        project_name: opt("project_name"),
        country: opt("country"),
        sector: opt("sector"),
        stage: opt("stage"),
        link: opt("link"),
        attachment_path,
      });
      if (error) throw error;
      setState("ok");
      form.reset();
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  return (
    <>
      <div className="dot-grid">
        <PageHero label={c.label} title={c.title} />
      </div>
      <Section label={c.label} className="pt-8 md:pt-10">
        <div role="tablist" className="mb-12 flex border-b border-line">
          {(["project", "contact"] as Tab[]).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => {
                setTab(k);
                setErrors({});
                setState("idle");
              }}
              className={cn(
                "-mb-px border-b-2 px-1 py-4 mr-8 text-xs uppercase tracking-[.1em] transition-colors",
                tab === k ? "border-accent text-ink-strong" : "border-transparent text-muted-foreground hover:text-ink-strong",
              )}
            >
              {k === "project" ? c.tabProject : c.tabGeneral}
            </button>
          ))}
        </div>

        <form key={tab} onSubmit={onSubmit} noValidate className="grid max-w-3xl gap-10 md:grid-cols-2">
          <Field id="name" label={c.name} error={errors.name}>
            <input id="name" name="name" className="field" autoComplete="name" required maxLength={200} />
          </Field>
          <Field id="email" label={c.email} error={errors.email}>
            <input id="email" name="email" type="email" className="field" autoComplete="email" required maxLength={255} />
          </Field>
          <Field id="organisation" label={c.organisation} className="md:col-span-2">
            <input id="organisation" name="organisation" className="field" autoComplete="organization" maxLength={200} />
          </Field>

          {tab === "project" && (
            <>
              <Field id="project_name" label={c.projectName} error={errors.project_name}>
                <input id="project_name" name="project_name" className="field" required maxLength={200} />
              </Field>
              <Field id="country" label={c.country}>
                <input id="country" name="country" className="field" autoComplete="country-name" maxLength={100} />
              </Field>
              <Field id="sector" label={c.sector}>
                <input id="sector" name="sector" className="field" maxLength={100} />
              </Field>
              <Field id="stage" label={c.stage}>
                <select id="stage" name="stage" className="field" defaultValue="">
                  <option value="">—</option>
                  {c.stages.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="link" label={c.link} className="md:col-span-2">
                <input id="link" name="link" type="url" className="field" placeholder="https://" maxLength={500} />
              </Field>
            </>
          )}

          <Field id="message" label={tab === "project" ? c.description : c.message} error={errors.message} className="md:col-span-2">
            <textarea id="message" name="message" rows={5} className="field resize-y" required maxLength={5000} />
          </Field>

          {tab === "project" && (
            <Field id="attachment" label={c.attachment} error={errors.attachment} className="md:col-span-2">
              <input
                id="attachment"
                name="attachment"
                type="file"
                className="field file:mr-4 file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:text-foreground"
              />
            </Field>
          )}

          <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
            <button
              type="submit"
              disabled={state === "sending"}
              className="bg-accent px-[30px] py-[20px] text-sm uppercase tracking-[.08em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {state === "sending" ? c.sending : c.send} →
            </button>
            <p role="status" className={cn("font-sans text-[15px]", state === "error" ? "text-destructive" : "text-accent")}>
              {state === "ok" ? c.success : state === "error" ? c.error : ""}
            </p>
          </div>
        </form>
      </Section>
    </>
  );
}
