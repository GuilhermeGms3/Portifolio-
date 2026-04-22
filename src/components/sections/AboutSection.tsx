import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Who I Am" — 450vh pinned cinematic scroll scene with 4 phases.
 * Phase 1: identity words assemble
 * Phase 2: infrastructure network diagram
 * Phase 3: development pipeline
 * Phase 4: synthesis statement + pills
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Phase containers
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const p4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: 2,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 1: 0 → 0.22 visible
          const p1 = clamp((0.22 - p) / 0.22) > 0 ? 1 : 0;
          // smoother fade
          const p1Op = p < 0.18 ? 1 : clamp((0.25 - p) / 0.07);
          if (p1Ref.current) {
            p1Ref.current.style.opacity = String(p1Op);
            p1Ref.current.style.filter = `blur(${(1 - p1Op) * 12}px)`;
            p1Ref.current.style.transform = `scale(${0.95 + p1Op * 0.05})`;
          }
          // animate the word pairs based on a mini progress
          animatePairs(p1Ref.current, p);

          // Phase 2: 0.22 → 0.48
          const p2Op =
            p < 0.22 ? 0 : p < 0.42 ? clamp((p - 0.22) / 0.08) : clamp((0.5 - p) / 0.08);
          if (p2Ref.current) {
            p2Ref.current.style.opacity = String(p2Op);
            p2Ref.current.style.transform = `translateY(${(1 - p2Op) * 30}px)`;
          }
          drawNetwork(p2Ref.current, clamp((p - 0.22) / 0.22));

          // Phase 3: 0.48 → 0.72
          const p3Op =
            p < 0.48 ? 0 : p < 0.66 ? clamp((p - 0.48) / 0.08) : clamp((0.74 - p) / 0.08);
          if (p3Ref.current) {
            p3Ref.current.style.opacity = String(p3Op);
            p3Ref.current.style.transform = `translateY(${(1 - p3Op) * 30}px)`;
          }
          drawPipeline(p3Ref.current, clamp((p - 0.48) / 0.22));

          // Phase 4: 0.72 → 1
          const p4Op = clamp((p - 0.72) / 0.12);
          if (p4Ref.current) {
            p4Ref.current.style.opacity = String(p4Op);
            p4Ref.current.style.transform = `translateY(${(1 - p4Op) * 30}px)`;
          }
          revealSynthesis(p4Ref.current, p4Op);
          // unused vars suppress
          void p1;
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{ height: "450vh", background: "var(--surface-1)" }}
    >
      <div
        ref={stickyRef}
        className="h-screen w-full overflow-hidden relative grid-lines"
      >
        {/* faint horizontal gradient line */}
        <div className="absolute top-1/2 left-0 right-0 h-px grad-bg opacity-40 -translate-y-1/2" />

        {/* PHASE 1 — IDENTITY */}
        <div
          ref={p1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <div className="w-full max-w-6xl space-y-2 md:space-y-4 text-center">
            <IdentityRow left="NOC" right="ANALYST" />
            <IdentityRow left="DEVOPS" right="ENGINEER" />
            <IdentityRow left="SOFTWARE" right="DEVELOPER" />
          </div>
          <p className="mt-10 font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-muted">
            Três especialidades. Uma visão integrada de tecnologia.
          </p>
        </div>

        {/* PHASE 2 — INFRASTRUCTURE */}
        <div
          ref={p2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0"
        >
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-blue mb-4">
            // 02 · infrastructure
          </div>
          <NetworkDiagram />
          <p className="mt-8 font-display text-xl md:text-3xl text-white tracking-tight">
            Infraestrutura é minha <span className="grad-text font-semibold">base</span>.
          </p>
        </div>

        {/* PHASE 3 — DEVELOPMENT */}
        <div
          ref={p3Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0"
        >
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-green mb-4">
            // 03 · development
          </div>
          <PipelineDiagram />
          <p className="mt-8 font-display text-xl md:text-3xl text-white tracking-tight">
            Desenvolvimento é minha <span className="grad-text font-semibold">expansão</span>.
          </p>
        </div>

        {/* PHASE 4 — SYNTHESIS */}
        <div
          ref={p4Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0"
        >
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-6">
            // synthesis
          </div>
          <h2
            id="synthesis-headline"
            className="font-display font-semibold text-3xl md:text-6xl lg:text-7xl tracking-tight text-center max-w-5xl leading-[1.05]"
          >
            Eu conecto <span className="grad-text">infraestrutura</span> e{" "}
            <span className="grad-text">código</span>.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3" id="synthesis-pills">
            {[
              { icon: "🔧", label: "NOC & DevOps" },
              { icon: "⚙️", label: "Automação" },
              { icon: "💻", label: "Desenvolvimento" },
            ].map((p) => (
              <div
                key={p.label}
                className="grad-border glass rounded-full px-5 py-2.5 flex items-center gap-2 font-mono text-sm text-white"
              >
                <span>{p.icon}</span> {p.label}
              </div>
            ))}
          </div>
          <a
            href="#skills"
            className="mt-12 font-mono text-xs tracking-[0.3em] uppercase text-muted hover:text-white transition-colors"
          >
            Conheça meu trabalho ↓
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── helpers ───────────── */

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

function IdentityRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-10 font-display font-bold tracking-tighter text-4xl md:text-7xl lg:text-8xl">
      <span data-pair="left" className="text-white" style={{ willChange: "transform, opacity" }}>
        {left}
      </span>
      <span data-pair="dot" className="grad-text" aria-hidden>·</span>
      <span data-pair="right" className="grad-text" style={{ willChange: "transform, opacity" }}>
        {right}
      </span>
    </div>
  );
}

function animatePairs(root: HTMLElement | null, progress: number) {
  if (!root) return;
  const rows = root.querySelectorAll<HTMLElement>(".font-display.font-bold");
  rows.forEach((row, i) => {
    // each row animates in across a slice of phase 1 (0 → 0.22)
    const start = (i / rows.length) * 0.18;
    const end = start + 0.08;
    const t = clamp((progress - start) / (end - start));
    const eased = 1 - Math.pow(1 - t, 3);
    const left = row.querySelector<HTMLElement>("[data-pair='left']");
    const right = row.querySelector<HTMLElement>("[data-pair='right']");
    const dot = row.querySelector<HTMLElement>("[data-pair='dot']");
    if (left) {
      left.style.transform = `translateX(${(1 - eased) * -200}px) scale(${0.7 + eased * 0.3})`;
      left.style.opacity = String(eased);
    }
    if (right) {
      right.style.transform = `translateX(${(1 - eased) * 200}px) scale(${0.7 + eased * 0.3})`;
      right.style.opacity = String(eased);
    }
    if (dot) dot.style.opacity = String(Math.pow(eased, 3));
  });
}

function NetworkDiagram() {
  const peripherals = ["Monitoramento", "Firewall", "Incidentes", "Linux", "Automação"];
  return (
    <svg viewBox="0 0 600 360" className="w-full max-w-3xl h-auto">
      <defs>
        <linearGradient id="netGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
        <filter id="glowBlue">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {peripherals.map((name, i) => {
        const angle = (i / peripherals.length) * Math.PI * 2 - Math.PI / 2;
        const x = 300 + Math.cos(angle) * 200;
        const y = 180 + Math.sin(angle) * 130;
        return (
          <g key={name} className="net-node" data-idx={i}>
            <line
              x1="300" y1="180" x2={x} y2={y}
              stroke="url(#netGrad)" strokeWidth="1"
              className="net-line"
              strokeDasharray="300" strokeDashoffset="300"
            />
            <circle
              cx={x} cy={y} r="6"
              fill="#0a0a0a" stroke="#1A6EFF" strokeWidth="1.5"
              filter="url(#glowBlue)"
            />
            <text
              x={x} y={y - 14}
              textAnchor="middle"
              fontFamily="IBM Plex Mono"
              fontSize="11"
              fill="#a0aec0"
            >
              {name}
            </text>
          </g>
        );
      })}
      <circle cx="300" cy="180" r="22" fill="#0a0a0a" stroke="url(#netGrad)" strokeWidth="2" filter="url(#glowBlue)" />
      <circle cx="300" cy="180" r="6" fill="url(#netGrad)" />
    </svg>
  );
}

function drawNetwork(root: HTMLElement | null, progress: number) {
  if (!root) return;
  const lines = root.querySelectorAll<SVGLineElement>(".net-line");
  lines.forEach((line, i) => {
    const start = i * 0.1;
    const t = clamp((progress - start) / 0.4);
    line.style.strokeDashoffset = String(300 * (1 - t));
  });
}

function PipelineDiagram() {
  const steps = ["Input", "Process", "Output", "Deploy"];
  return (
    <svg viewBox="0 0 720 180" className="w-full max-w-3xl h-auto">
      <defs>
        <linearGradient id="pipeGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
        <marker id="pipeArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#00FF41" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const x = 30 + i * 175;
        return (
          <g key={s} className="pipe-node">
            <rect
              x={x} y="60" width="140" height="60" rx="6"
              fill="rgba(255,255,255,0.03)"
              stroke="url(#pipeGrad)" strokeWidth="1.2"
              className="pipe-fill"
              style={{ opacity: 0 }}
            />
            <text x={x + 70} y="96" textAnchor="middle" fontFamily="Space Grotesk" fontSize="16" fill="#ffffff" fontWeight="600">
              {s}
            </text>
            {i < steps.length - 1 && (
              <line
                x1={x + 140} y1="90" x2={x + 175} y2="90"
                stroke="url(#pipeGrad)" strokeWidth="1.5"
                markerEnd="url(#pipeArrow)"
                className="pipe-arrow"
                strokeDasharray="35" strokeDashoffset="35"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function drawPipeline(root: HTMLElement | null, progress: number) {
  if (!root) return;
  const fills = root.querySelectorAll<SVGRectElement>(".pipe-fill");
  const arrows = root.querySelectorAll<SVGLineElement>(".pipe-arrow");
  fills.forEach((el, i) => {
    const start = i * 0.18;
    const t = clamp((progress - start) / 0.2);
    el.style.opacity = String(t);
  });
  arrows.forEach((el, i) => {
    const start = i * 0.18 + 0.1;
    const t = clamp((progress - start) / 0.2);
    el.style.strokeDashoffset = String(35 * (1 - t));
  });
}

function revealSynthesis(root: HTMLElement | null, progress: number) {
  if (!root) return;
  // char-by-char reveal of headline using clip-path
  const headline = root.querySelector<HTMLElement>("#synthesis-headline");
  if (headline) {
    headline.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
  }
  const pills = root.querySelectorAll<HTMLElement>("#synthesis-pills > *");
  pills.forEach((pill, i) => {
    const start = 0.4 + i * 0.15;
    const t = clamp((progress - start) / 0.25);
    pill.style.transform = `translateY(${(1 - t) * 30}px)`;
    pill.style.opacity = String(t);
  });
}
