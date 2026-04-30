import { useEffect, useRef } from "react";

/**
 * SideAmbient — single continuous global background.
 *
 * Layers:
 *  1. Full-page very subtle dotted matrix (CSS).
 *  2. Canvas with structured geometric dotted clusters drifting on the LEFT and RIGHT edges.
 *     Center is masked out so content remains dominant and readable.
 *
 * Fixed, behind all content, pointer-events: none, no section seams.
 */
export function SideAmbient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxRaw = canvasEl.getContext("2d", { alpha: true });
    if (!ctxRaw) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    type Cluster = {
      side: "left" | "right";
      cx: number; // base center x (0..1 of viewport width)
      cy: number; // base center y (0..1 of viewport height)
      radius: number; // cluster radius in px
      points: Array<{ ox: number; oy: number; r: number; a: number; phase: number }>;
      driftX: number;
      driftY: number;
      speed: number;
      hue: { r: number; g: number; b: number };
    };

    let clusters: Cluster[] = [];

    const PALETTE = [
      { r: 90, g: 150, b: 255 },   // cold blue
      { r: 80, g: 200, b: 220 },   // cyan
      { r: 60, g: 170, b: 160 },   // dim teal
      { r: 140, g: 110, b: 220 },  // subtle purple
      { r: 220, g: 170, b: 90 },   // muted amber
    ];

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function buildClusters() {
      clusters = [];
      const isMobile = width < 768;
      if (isMobile) return; // hide on mobile for perf

      const sides: Array<"left" | "right"> = ["left", "right"];
      // Distribute several clusters vertically per side so it spans the whole scroll
      const verticalSlots = 5;

      sides.forEach((side) => {
        for (let i = 0; i < verticalSlots; i++) {
          const cy = (i + 0.5) / verticalSlots + rand(-0.04, 0.04);
          const cxBase = side === "left" ? rand(0.04, 0.14) : rand(0.86, 0.96);
          const radius = rand(110, 190);
          const pointCount = Math.floor(rand(38, 64));

          // Build a structured point set: hex-ish lattice with noise → "dotted cluster"
          const points: Cluster["points"] = [];
          const ringCount = 4;
          for (let ring = 0; ring < ringCount; ring++) {
            const ringR = (ring / (ringCount - 1)) * radius;
            const slots = ring === 0 ? 1 : Math.floor(6 * ring + rand(-1, 2));
            for (let s = 0; s < slots; s++) {
              const angle = (s / slots) * Math.PI * 2 + rand(-0.15, 0.15);
              const jitterR = ringR + rand(-8, 8);
              const ox = Math.cos(angle) * jitterR + rand(-4, 4);
              const oy = Math.sin(angle) * jitterR + rand(-4, 4);
              points.push({
                ox,
                oy,
                r: rand(0.6, 1.6),
                a: rand(0.25, 0.85) * (1 - ring / (ringCount + 1)),
                phase: rand(0, Math.PI * 2),
              });
            }
          }
          // Sprinkle a few outliers to feel organic but still structured
          const extras = Math.max(0, pointCount - points.length);
          for (let k = 0; k < extras; k++) {
            const a = rand(0, Math.PI * 2);
            const r = rand(0, radius * 1.05);
            points.push({
              ox: Math.cos(a) * r,
              oy: Math.sin(a) * r,
              r: rand(0.5, 1.3),
              a: rand(0.15, 0.55),
              phase: rand(0, Math.PI * 2),
            });
          }

          clusters.push({
            side,
            cx: cxBase,
            cy,
            radius,
            points,
            driftX: rand(8, 22) * (side === "left" ? 1 : -1),
            driftY: rand(10, 28),
            speed: rand(0.00012, 0.00028),
            hue: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          });
        }
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildClusters();
    }

    function maskAlphaForX(x: number) {
      // Visible at edges, fades to ~0 toward the center.
      const edgeZone = Math.min(width * 0.35, 520);
      const distFromEdge = Math.min(x, width - x);
      if (distFromEdge >= edgeZone) return 0;
      const t = 1 - distFromEdge / edgeZone; // 1 at edge, 0 at inner
      // ease-out cubic
      return t * t * t;
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);

      for (const c of clusters) {
        const t = time * c.speed;
        const driftX = Math.sin(t) * c.driftX;
        const driftY = Math.cos(t * 0.85) * c.driftY;
        const baseX = c.cx * width + driftX;
        const baseY = c.cy * height + driftY;

        for (const p of c.points) {
          // Subtle internal shimmer/breathing per point
          const shimmer = 0.65 + 0.35 * Math.sin(time * 0.0008 + p.phase);
          const px = baseX + p.ox + Math.sin(time * 0.0004 + p.phase) * 1.4;
          const py = baseY + p.oy + Math.cos(time * 0.0004 + p.phase) * 1.4;

          const m = maskAlphaForX(px);
          if (m <= 0) continue;

          const alpha = p.a * shimmer * m;
          if (alpha < 0.02) continue;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${c.hue.r}, ${c.hue.g}, ${c.hue.b}, ${alpha})`;
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();

          // soft halo on slightly larger points
          if (p.r > 1.1) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${c.hue.r}, ${c.hue.g}, ${c.hue.b}, ${alpha * 0.18})`;
            ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    let last = 0;
    function loop(now: number) {
      // throttle to ~40fps for perf; motion is meant to be slow
      if (now - last > 25) {
        draw(now);
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    if (reduceMotion) {
      draw(0);
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Layer 1 — global subtle dotted matrix across the entire viewport */}
      <div
        className="absolute inset-0 ambient-grid-global"
        style={{ opacity: 0.45 }}
      />

      {/* Layer 2 — vignette to keep center deeper than edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Layer 3 — geometric structured dotted clusters on the sides */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 hidden md:block"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
