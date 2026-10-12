import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { teamData, teamLogin, teamLogout } from "@/lib/team.functions";
import { fr } from "@/i18n/fr";

export const Route = createFileRoute("/espace-equipe")({
  head: () => ({
    meta: [
      { title: "Espace équipe — MQS_Advisor" },
      { name: "description", content: "Espace privé de l'équipe MQS_Advisor." },
      { property: "og:title", content: "Espace équipe — MQS_Advisor" },
      { property: "og:description", content: "Espace privé de l'équipe MQS_Advisor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => teamData(),
  component: TeamSpace,
});

const TABS = [
  { key: "application", label: "Candidatures" },
  { key: "contact", label: "Messages contact" },
  { key: "project", label: "Projets soumis" },
  { key: "portfolio", label: "Portefeuille" },
] as const;

function Login() {
  const router = useRouter();
  const login = useServerFn(teamLogin);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { ok } = await login({ data: { password: pw } });
    setBusy(false);
    if (ok) router.invalidate();
    else setErr(true);
  };
  return (
    <section className="mx-auto max-w-md px-5 py-24">
      <div className="label-mono text-accent">[ÉQUIPE] Accès privé</div>
      <h1 className="h-section mt-4">Connexion</h1>
      <form onSubmit={onSubmit} className="mt-10">
        <label htmlFor="pw" className="label-mono block text-muted-foreground">Mot de passe</label>
        <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="field" />
        {err && <p role="alert" className="mt-3 text-sm text-destructive">Mot de passe incorrect.</p>}
        <button disabled={busy || !pw} className="mt-6 bg-accent px-[30px] py-[18px] text-sm uppercase tracking-[.08em] text-accent-foreground disabled:opacity-50">
          {busy ? "…" : "Entrer →"}
        </button>
      </form>
    </section>
  );
}

function TeamSpace() {
  const d = Route.useLoaderData();
  const router = useRouter();
  const logout = useServerFn(teamLogout);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("application");
  if (!d.unlocked) return <Login />;
  const rows = d.submissions.filter((s) => s.kind === tab);
  const count = (k: string) => d.submissions.filter((s) => s.kind === k).length;

  return (
    <section className="px-5 py-16 md:px-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="label-mono text-accent">[ÉQUIPE] Espace privé</div>
          <h1 className="h-section mt-4">Tableau de bord</h1>
        </div>
        <button onClick={async () => { await logout(); router.invalidate(); }} className="label-mono border border-line px-4 py-3 text-muted-foreground hover:text-ink-strong">
          Se déconnecter
        </button>
      </div>
      <div className="mt-10 flex flex-wrap gap-px bg-line">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`label-mono px-5 py-4 ${tab === t.key ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground hover:text-ink-strong"}`}>
            {t.label} {t.key !== "portfolio" && `(${count(t.key)})`}
          </button>
        ))}
      </div>

      {tab === "portfolio" ? (
        <div className="mt-px grid gap-px bg-line md:grid-cols-2">
          {fr.projects.map((p) => (
            <div key={p.slug} className="bg-background p-6">
              <div className="label-mono text-accent">{p.country} · {p.status === "live" ? "En ligne" : "En cours"}</div>
              <div className="mt-2 text-ink-strong">{p.name}</div>
              <p className="mt-2 font-sans text-sm text-muted-foreground">{p.sector || "—"} {p.url && <>· <a href={p.url} target="_blank" rel="noreferrer" className="text-accent">{p.url}</a></>}</p>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-10 font-sans text-muted-foreground">Aucun envoi pour le moment.</p>
      ) : (
        <div className="mt-px grid gap-px bg-line">
          {rows.map((r) => (
            <article key={r.id} className="bg-background p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="text-ink-strong">{r.name} <a href={`mailto:${r.email}`} className="text-accent">{r.email}</a></div>
                <div className="label-mono text-dim">{new Date(r.created_at).toLocaleString("fr-FR")} · {r.lang.toUpperCase()}</div>
              </div>
              <div className="label-mono mt-2 text-muted-foreground">
                {[r.organisation, r.project_name, r.country, r.sector, r.stage].filter(Boolean).join(" · ")}
              </div>
              <p className="mt-4 whitespace-pre-wrap font-sans text-[15px] text-muted-2">{r.message}</p>
              <div className="mt-3 flex gap-6 text-sm">
                {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="text-accent">Lien →</a>}
                {r.fileUrl && <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-accent">Pièce jointe →</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
