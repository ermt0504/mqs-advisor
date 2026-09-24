import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CountryCode = "CA" | "FR" | "SN" | "DJ";
type Vec = [number, number, number];

const ACCENT = "190,236,90";
const WARM = "255,255,255";

let landPromise: Promise<Vec[] | null> | null = null;

/** Loads world land once, rasterizes it, keeps Fibonacci-sphere points on land. */
function loadLand(): Promise<Vec[] | null> {
  if (landPromise) return landPromise;
  landPromise = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
    .then((r) => r.json())
    .then((topo) => {
      const [sx, sy] = topo.transform.scale;
      const [tx, ty] = topo.transform.translate;
      const arcs: number[][][] = topo.arcs.map((a: number[][]) => {
        let x = 0;
        let y = 0;
        return a.map(([dx, dy]) => {
          x += dx!;
          y += dy!;
          return [x * sx + tx, y * sy + ty];
        });
      });
      const W = 1440;
      const H = 720;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const g = cv.getContext("2d")!;
      g.fillStyle = "#000";
      g.beginPath();
      const ring = (r: number[]) => {
        let pts: number[][] = [];
        r.forEach((i, k) => {
          const a = (i < 0 ? arcs[~i]!.slice().reverse() : arcs[i]!) as number[][];
          pts = pts.concat(k ? a.slice(1) : a);
        });
        pts.forEach(([lo, la], j) => {
          const X = ((lo! + 180) / 360) * W;
          const Y = ((90 - la!) / 180) * H;
          if (j) g.lineTo(X, Y);
          else g.moveTo(X, Y);
        });
        g.closePath();
      };
      topo.objects.land.geometries.forEach((geo: { type: string; arcs: number[][] | number[][][] }) => {
        const polys = (geo.type === "Polygon" ? [geo.arcs] : geo.arcs) as number[][][];
        polys.forEach((p) => p.forEach(ring));
      });
      g.fill("evenodd");
      const data = g.getImageData(0, 0, W, H).data;
      const pts: Vec[] = [];
      const N = 22000;
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * 2.39996;
        const p: Vec = [Math.cos(t) * r, y, Math.sin(t) * r];
        const la = (Math.asin(p[1]) * 180) / Math.PI;
        const lo = (Math.atan2(p[0], p[2]) * 180) / Math.PI;
        const X = Math.min(W - 1, Math.floor(((lo + 180) / 360) * W));
        const Y = Math.min(H - 1, Math.floor(((90 - la) / 180) * H));
        if (data[(Y * W + X) * 4 + 3]! > 0) pts.push(p);
      }
      return pts;
    })
    .catch(() => {
      landPromise = null;
      return null;
    });
  return landPromise;
}

const v = (lat: number, lon: number): Vec => {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};

const CITIES: { code: CountryCode; p: Vec; hq?: boolean }[] = [
  { code: "CA", p: v(45.5, -73.6), hq: true },
  { code: "FR", p: v(48.85, 2.35) },
  { code: "SN", p: v(14.7, -17.4) },
  { code: "DJ", p: v(11.6, 43.1) },
];

export function Globe({
  labels,
  counts,
  countLabel,
  onSelect,
  selected,
  className,
  ariaLabel,
}: {
  labels: Record<CountryCode, string>;
  counts: Record<CountryCode, number>;
  countLabel: (n: number) => string;
  onSelect?: (c: CountryCode) => void;
  selected?: CountryCode | null;
  className?: string;
  ariaLabel: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ code: CountryCode; x: number; y: number } | null>(null);
  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const selRef = useRef(selected);
  selRef.current = selected;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const c = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = c.getContext("2d")!;
    const st = {
      rot: -0.9,
      drag: null as null | { x: number; y: number; r: number; moved: boolean },
      land: null as Vec[] | null,
      raf: 0,
      visible: true,
      dead: false,
      hits: [] as { code: CountryCode; x: number; y: number }[],
      hover: null as CountryCode | null,
      dpr: 1,
    };
    loadLand().then((p) => (st.land = p));

    const resize = () => {
      const w = wrap.clientWidth;
      st.dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(w * st.dpr));
      c.height = c.width;
      c.style.width = w + "px";
      c.style.height = w + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const tilt = -0.4;
    const ct = Math.cos(tilt);
    const sn = Math.sin(tilt);
    const slerp = (a: Vec, b: Vec, t: number): Vec => {
      const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const s = Math.sin(d);
      const k1 = Math.sin((1 - t) * d) / s;
      const k2 = Math.sin(t * d) / s;
      const h = 1 + 0.22 * Math.sin(Math.PI * t);
      return [(a[0] * k1 + b[0] * k2) * h, (a[1] * k1 + b[1] * k2) * h, (a[2] * k1 + b[2] * k2) * h];
    };

    let t0 = performance.now();
    const frame = (now: number) => {
      if (st.dead) return;
      const dt = now - t0;
      t0 = now;
      if (!st.visible) {
        st.raf = 0;
        return;
      }
      if (!st.drag && !st.hover) st.rot -= dt * 0.00008;
      const S = c.width;
      const k = S / 1280;
      const R = S * 0.42;
      const cx = S / 2;
      const cy = S / 2;
      const rot = st.rot;
      const ca = Math.cos(rot);
      const sa = Math.sin(rot);
      const proj = (p: Vec): Vec => {
        const x = p[0] * ca + p[2] * sa;
        const z = -p[0] * sa + p[2] * ca;
        const y = p[1];
        return [cx + x * R, cy - (y * ct - z * sn) * R, y * sn + z * ct];
      };
      ctx.clearRect(0, 0, S, S);
      const g = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.2);
      g.addColorStop(0, `rgba(${ACCENT},0.10)`);
      g.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.2, 0, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(10,14,22,0.55)";
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 7);
      ctx.fill();
      ctx.strokeStyle = `rgba(${ACCENT},0.25)`;
      ctx.lineWidth = 2 * k;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 7);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1.5 * k;
      for (let la = -60; la <= 60; la += 30) {
        ctx.beginPath();
        let on = false;
        for (let lo = -180; lo <= 180; lo += 4) {
          const q = proj(v(la, lo));
          if (q[2] < 0) { on = false; continue; }
          if (on) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
          on = true;
        }
        ctx.stroke();
      }
      for (let lo = -180; lo < 180; lo += 30) {
        ctx.beginPath();
        let on = false;
        for (let la = -90; la <= 90; la += 4) {
          const q = proj(v(la, lo));
          if (q[2] < 0) { on = false; continue; }
          if (on) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
          on = true;
        }
        ctx.stroke();
      }

      if (st.land) {
        for (const p of st.land) {
          const [x, y, z] = proj(p);
          if (z < 0) continue;
          ctx.fillStyle = `rgba(215,222,235,${0.15 + z * 0.7})`;
          const d = (2.2 + z * 1.4) * k;
          ctx.fillRect(x - d / 2, y - d / 2, d, d);
        }
      }

      const hq = CITIES[0]!;
      CITIES.slice(1).forEach((city, i) => {
        ctx.beginPath();
        let on = false;
        for (let s = 0; s <= 60; s++) {
          const q = proj(slerp(hq.p, city.p, s / 60));
          if (q[2] < -0.05) { on = false; continue; }
          if (on) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
          on = true;
        }
        ctx.strokeStyle = `rgba(${ACCENT},0.7)`;
        ctx.lineWidth = 3 * k;
        ctx.stroke();
        const q = proj(slerp(hq.p, city.p, (now / 2600 + i * 0.33) % 1));
        if (q[2] > 0) {
          ctx.fillStyle = `rgb(${WARM})`;
          ctx.beginPath();
          ctx.arc(q[0], q[1], 7 * k, 0, 7);
          ctx.fill();
        }
      });

      const hits: typeof st.hits = [];
      CITIES.forEach((city) => {
        const [x, y, z] = proj(city.p);
        if (z < 0) return;
        hits.push({ code: city.code, x: x / st.dpr, y: y / st.dpr });
        const pu = (now / 1400) % 1;
        const col = city.hq ? WARM : ACCENT;
        const active = st.hover === city.code || selRef.current === city.code;
        ctx.strokeStyle = `rgba(${col},${1 - pu})`;
        ctx.lineWidth = 3 * k;
        ctx.beginPath();
        ctx.arc(x, y, (10 + pu * 32) * k, 0, 7);
        ctx.stroke();
        ctx.fillStyle = `rgb(${col})`;
        ctx.beginPath();
        ctx.arc(x, y, (active ? 13 : 9) * k, 0, 7);
        ctx.fill();
        ctx.font = `600 ${Math.max(10 * st.dpr, 22 * k)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(240,242,246,${0.4 + z * 0.6})`;
        ctx.fillText(labelsRef.current[city.code].toUpperCase(), x + 20 * k, y + 8 * k);
      });
      st.hits = hits;
      st.raf = requestAnimationFrame(frame);
    };
    st.raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver((e) => {
      st.visible = e.some((x) => x.isIntersecting);
      if (st.visible && !st.raf && !st.dead) {
        t0 = performance.now();
        st.raf = requestAnimationFrame(frame);
      }
    });
    io.observe(c);

    const hitTest = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      let best: (typeof st.hits)[number] | null = null;
      let bd = 22;
      for (const h of st.hits) {
        const d = Math.hypot(h.x - px, h.y - py);
        if (d < bd) { bd = d; best = h; }
      }
      return best;
    };

    const down = (e: PointerEvent) => {
      st.drag = { x: e.clientX, y: e.clientY, r: st.rot, moved: false };
      c.style.cursor = "grabbing";
      c.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (st.drag) {
        if (Math.abs(e.clientX - st.drag.x) > 4) st.drag.moved = true;
        st.rot = st.drag.r + (e.clientX - st.drag.x) * 0.008 * (1280 / Math.max(300, c.clientWidth)) * 0.5;
        return;
      }
      const h = hitTest(e);
      const code = h?.code ?? null;
      if (code !== st.hover) {
        st.hover = code;
        c.style.cursor = code ? (onSelectRef.current ? "pointer" : "default") : "grab";
      }
      setHover(h ? { code: h.code, x: h.x, y: h.y } : null);
    };
    const up = (e: PointerEvent) => {
      const wasClick = st.drag && !st.drag.moved;
      st.drag = null;
      c.style.cursor = "grab";
      if (wasClick) {
        const h = hitTest(e);
        if (h && onSelectRef.current) onSelectRef.current(h.code);
      }
    };
    const leave = () => {
      if (!st.drag) {
        st.hover = null;
        setHover(null);
      }
    };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    c.addEventListener("pointerleave", leave);

    return () => {
      st.dead = true;
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
      c.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className="block cursor-grab"
        style={{ touchAction: "pan-y" }}
      />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 border border-line bg-background/90 px-3 py-2 text-xs uppercase tracking-[.1em] backdrop-blur"
          style={{ left: hover.x + 16, top: hover.y - 44 }}
        >
          <div className="text-ink-strong">{labels[hover.code]}</div>
          <div className="text-accent">{countLabel(counts[hover.code])}</div>
        </div>
      )}
      {onSelect && (
        <div className="sr-only">
          {CITIES.map((ci) => (
            <button key={ci.code} type="button" onClick={() => onSelect(ci.code)}>
              {labels[ci.code]} — {countLabel(counts[ci.code])}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
