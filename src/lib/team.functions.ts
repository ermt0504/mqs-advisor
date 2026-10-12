import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "mqs-team",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

async function digest(s: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
}

async function passwordMatches(input: string, expected: string) {
  const [a, b] = await Promise.all([digest(input), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export const teamStatus = createServerFn({ method: "GET" }).handler(async () => {
  const s = await useSession<GateSession>(sessionConfig());
  return { unlocked: !!s.data.unlocked };
});

export const teamLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["TEAM_PASSWORD"];
    if (!expected) return { ok: false as const };
    if (!(await passwordMatches(data.password, expected))) return { ok: false as const };
    const s = await useSession<GateSession>(sessionConfig());
    await s.update({ unlocked: true });
    return { ok: true as const };
  });

export const teamLogout = createServerFn({ method: "POST" }).handler(async () => {
  const s = await useSession<GateSession>(sessionConfig());
  await s.clear();
  return { ok: true as const };
});

export const teamData = createServerFn({ method: "GET" }).handler(async () => {
  const s = await useSession<GateSession>(sessionConfig());
  if (!s.data.unlocked) return { unlocked: false as const, submissions: [] };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error("Could not load submissions");
  const submissions = await Promise.all(
    (data ?? []).map(async (r) => {
      let fileUrl: string | null = null;
      if (r.attachment_path) {
        const { data: signed } = await supabaseAdmin.storage.from("attachments").createSignedUrl(r.attachment_path, 3600);
        fileUrl = signed?.signedUrl ?? null;
      }
      return { ...r, fileUrl };
    }),
  );
  return { unlocked: true as const, submissions };
});
