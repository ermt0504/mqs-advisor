import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/Blocks";
import { Reveal, Section } from "@/components/site/primitives";

const MAX = 10 * 1024 * 1024;
type Errs = Partial<Record<"name" | "email" | "role" | "message" | "cv", string>>;

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string | undefined; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function JoinPage() {
  const { t, lang } = useT();
  const j = t.join;
  const c = t.contact;
  const [errors, setErrors] = useState<Errs>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "").trim();
    const res = z
      .object({
        name: z.string().min(1, c.required).max(200),
        email: z.string().email(c.invalidEmail).max(255),
        role: z.string().min(1, c.required).max(100),
        message: z.string().min(1, c.required).max(5000),
      })
      .safeParse({ name: s("name"), email: s("email"), role: s("role"), message: s("message") });
    const errs: Errs = {};
    if (!res.success) res.error.issues.forEach((i) => (errs[i.path[0] as keyof Errs] = i.message));
    const file = fd.get("cv");
    const hasFile = file instanceof File && file.size > 0;
    if (hasFile && file.size > MAX) errs.cv = c.fileTooBig;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      let attachment_path: string | null = null;
      if (hasFile) {
        const ext = file.name.split(".").pop()?.slice(0, 8) ?? "bin";
        const path = `cv/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        attachment_path = path;
      }
      const { error } = await supabase.from("submissions").insert({
        kind: "application",
        lang,
        name: s("name"),
        email: s("email"),
        message: s("message"),
        project_name: s("role"),
        country: s("location").slice(0, 100) || null,
        link: s("link").slice(0, 500) || null,
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
        <PageHero label={j.label} title={j.title} />
      </div>
      <Section label={j.label} className="pt-8 md:pt-10">
        <p className="max-w-2xl font-sans text-xl leading-[1.55] text-muted-2">{j.intro}</p>
      </Section>
      <Section label={j.stepsLabel} className="pt-0 md:pt-0">
        <ol className="grid gap-px border border-line bg-line md:grid-cols-4">
          {j.steps.map((st, i) => (
            <Reveal key={st.title} delay={i * 80} className="bg-background p-8">
              <li className="list-none">
                <div className="label-mono text-accent">0{i + 1}</div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">{st.title}</h3>
                <p className="mt-3 font-sans text-muted-foreground">{st.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>
      <Section label={j.formLabel} className="pt-0 md:pt-0">
        {state === "ok" ? (
          <div role="status" className="max-w-3xl border border-accent p-8">
            <div className="label-mono text-accent">✓</div>
            <p className="mt-4 font-display text-2xl font-semibold">{j.success}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid max-w-3xl gap-10 md:grid-cols-2">
            <Field id="name" label={c.name} error={errors.name}>
              <input id="name" name="name" className="field" autoComplete="name" maxLength={200} />
            </Field>
            <Field id="email" label={c.email} error={errors.email}>
              <input id="email" name="email" type="email" className="field" autoComplete="email" maxLength={255} />
            </Field>
            <Field id="role" label={j.role} error={errors.role}>
              <select id="role" name="role" className="field" defaultValue="">
                <option value="">—</option>
                {j.roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field id="location" label={j.location}>
              <input id="location" name="location" className="field" maxLength={100} />
            </Field>
            <Field id="link" label={j.linkLabel} className="md:col-span-2">
              <input id="link" name="link" type="url" className="field" placeholder="https://" maxLength={500} />
            </Field>
            <Field id="message" label={j.motivation} error={errors.message} className="md:col-span-2">
              <textarea id="message" name="message" rows={5} className="field resize-y" maxLength={5000} />
            </Field>
            <Field id="cv" label={j.cv} error={errors.cv} className="md:col-span-2">
              <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" className="field file:mr-4 file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:text-foreground" />
            </Field>
            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
              <button type="submit" disabled={state === "sending"} className="bg-accent px-[30px] py-[20px] text-sm uppercase tracking-[.08em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                {state === "sending" ? c.sending : c.send} →
              </button>
              <p role="status" className={cn("font-sans text-[15px] text-destructive")}>{state === "error" ? c.error : ""}</p>
            </div>
          </form>
        )}
      </Section>
    </>
  );
}
