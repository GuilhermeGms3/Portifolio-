import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * "A Jornada de um Pacote IP" — traceroute visualization.
 * Left: terminal typing traceroute output as user scrolls.
 * Right: SVG topology revealing nodes + ping packets per phase.
 * After packet reaches destination: career cards slide in.
 */

type Hop = {
  id: string;
  cmd: string;
  label: string;
  card: {
    badge: string;
    period: string;
    title: string;
    body: string;
    tags: string[];
  } | null;
  color: string;
};

const HOPS: Hop[] = [
  {
    id: "modem",
    cmd: "Hop 1:  modem-casa.local        1ms  [ORIGIN]",
    label: "modem-casa.local",
    card: null,
    color: "#1A6EFF",
  },
  {
    id: "isp",
    cmd: "Hop 2:  isp-gateway.net         4ms  [ISP]",
    label: "isp-gateway.net",
    card: {
      badge: "[HOP 01]",
      period: "Janeiro 2024 — Dezembro 2025",
      title: "Service Desk N2",
      body: "Atendimento e resolução de chamados N2, suporte técnico avançado, diagnóstico de falhas em infraestrutura, escalonamento e gestão de incidentes críticos. Ambiente corporativo com ferramentas de monitoramento e ticketing.",
      tags: ["N2 Support", "Incident Management", "Infra"],
    },
    color: "#00D4FF",
  },
  {
    id: "backbone",
    cmd: "Hop 3:  internet-backbone.net   12ms [INTERNET]",
    label: "internet-backbone.net",
    card: {
      badge: "[HOP 02]",
      period: "Em desenvolvimento",
      title: "DevOps & Automação",
      body: "Automação com Shell Script e Python, pipelines CI/CD, Docker, Kubernetes, Terraform, Grafana, Zabbix e Prometheus.",
      tags: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    },
    color: "#00D4FF",
  },
  {
    id: "destination",
    cmd: "Hop 4:  guilherme.dev           18ms [DESTINATION]",
    label: "guilherme.dev — DESTINATION REACHED",
    card: {
      badge: "[DESTINATION]",
      period: "Presente & Futuro",
      title: "Full Stack Developer",
      body: "Projetos em Python, TypeScript, Java Spring Boot e React. Freelas e oportunidades que conectem infraestrutura e desenvolvimento.",
      tags: ["Python", "TypeScript", "React", "Java Spring"],
    },
    color: "#00FF41",
  },
];

const TERMINAL_HEADER = [
  "$ traceroute guilherme.dev",
  "traceroute to guilherme.dev, 4 hops max",
];
const TERMINAL_FOOTER = [
  "> Resolving route...",
  "> Connection established.",
  "> Welcome to guilherme.dev",
];

// Node positions in SVG viewBox 0 0 800 600
const NODE_POS = [
  { x: 90, y: 130 },
  { x: 290, y: 240 },
  { x: 510, y: 360 },
  { x: 710, y: 480 },
];

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

function NodeIcon({ kind, color }: { kind: string; color: string }) {
  // simple inline svg shapes
  if (kind === "modem") {
    return (
      <g>
        <rect x={-18} y={-12} width={36} height={24} rx={3} fill="#0a0a0a" stroke={color} strokeWidth={1.5} />
        <circle cx={-10} cy={0} r={2} fill={color} />
        <circle cx={-2} cy={0} r={2} fill={color} />
        <circle cx={6} cy={0} r={2} fill={color} />
        <line x1={-22} y1={-16} x2={-14} y2={-22} stroke={color} strokeWidth={1.2} />
        <line x1={22} y1={-16} x2={14} y2={-22} stroke={color} strokeWidth={1.2} />
      </g>
    );
  }
  if (kind === "isp") {
    return (
      <g>
        <line x1={0} y1={-22} x2={-12} y2={14} stroke={color} strokeWidth={1.5} />
        <line x1={0} y1={-22} x2={12} y2={14} stroke={color} strokeWidth={1.5} />
        <line x1={-10} y1={6} x2={10} y2={6} stroke={color} strokeWidth={1.2} />
        <circle cx={0} cy={-22} r={3} fill={color} />
      </g>
    );
  }
  if (kind === "backbone") {
    return (
      <g>
        <circle cx={0} cy={0} r={18} fill="none" stroke={color} strokeWidth={1.5} />
        <ellipse cx={0} cy={0} rx={18} ry={7} fill="none" stroke={color} strokeWidth={1} />
        <line x1={-18} y1={0} x2={18} y2={0} stroke={color} strokeWidth={1} />
      </g>
    );
  }
  // destination — laptop
  return (
    <g>
      <rect x={-18} y={-14} width={36} height={22} rx={2} fill="#0a0a0a" stroke={color} strokeWidth={1.5} />
      <rect x={-22} y={8} width={44} height={3} rx={1} fill={color} />
      <circle cx={0} cy={-3} r={1.5} fill={color} />
    </g>
  );
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const lineRefs = useRef<Array<SVGPathElement | null>>([]);
  const pingRefs = useRef<Array<SVGCircleElement | null>>([]);
  const rippleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const scrubVal = isMobile ? 8 : 16;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: scrubVal,
        snap: {
          snapTo: [0, 0.25, 0.5, 0.75, 1],
          duration: { min: 0.8, max: 1.5 },
          ease: "power2.inOut",
          delay: 0.3,
        },
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Per-frame DOM updates driven by progress
  useEffect(() => {
    const p = progress;
    HOPS.forEach((hop, i) => {
      // each hop is reached at fractions: 0.18, 0.40, 0.62, 0.84
      const reachAt = 0.18 + i * 0.22;
      const arrivalT = clamp((p - (reachAt - 0.12)) / 0.12);
      const node = nodeRefs.current[i];
      const card = cardRefs.current[i];
      const ping = pingRefs.current[i];
      const ripple = rippleRefs.current[i];
      const lineToHere = i > 0 ? lineRefs.current[i - 1] : null;

      // Node fade & scale-in
      if (node) {
        node.style.opacity = String(arrivalT);
        const scale = 0.6 + arrivalT * 0.4;
        const pulse =
          arrivalT >= 1 && p < reachAt + 0.05
            ? 1 + Math.sin((p - reachAt + 0.05) * 60) * 0.15
            : 1;
        node.setAttribute(
          "transform",
          `translate(${NODE_POS[i].x} ${NODE_POS[i].y}) scale(${scale * pulse})`,
        );
      }

      // Connection line draws as packet approaches
      if (lineToHere) {
        const len = 800;
        const lt = clamp((p - (reachAt - 0.18)) / 0.16);
        lineToHere.style.strokeDasharray = `${len}`;
        lineToHere.style.strokeDashoffset = String(len * (1 - lt));
        lineToHere.style.opacity = String(0.3 + lt * 0.5);
      }

      // Ping packet travels along previous line as we approach
      if (ping && i > 0) {
        const lt = clamp((p - (reachAt - 0.16)) / 0.14);
        const from = NODE_POS[i - 1];
        const to = NODE_POS[i];
        const x = from.x + (to.x - from.x) * lt;
        const y = from.y + (to.y - from.y) * lt;
        ping.setAttribute("cx", String(x));
        ping.setAttribute("cy", String(y));
        ping.style.opacity = lt > 0 && lt < 1 ? "1" : "0";
      }

      // Ripple at arrival
      if (ripple) {
        const rt = clamp((p - reachAt) / 0.06);
        if (rt > 0 && rt < 1) {
          ripple.setAttribute("r", String(8 + rt * 30));
          ripple.style.opacity = String(1 - rt);
        } else {
          ripple.style.opacity = "0";
        }
      }

      // Card reveal — only for hops with cards, after destination is closer
      if (card && hop.card) {
        // Cards reveal in sequence after packet reaches each node
        const cardT = clamp((p - (reachAt + 0.02)) / 0.08);
        card.style.opacity = String(cardT);
        card.style.transform = `translateX(${(1 - cardT) * 60}px)`;
      }
    });
  }, [progress]);

  // Build accumulated terminal lines based on progress
  const reachedCount = HOPS.filter((_, i) => progress >= 0.18 + i * 0.22 - 0.05).length;
  const hopLines = HOPS.slice(0, reachedCount).map((h) => h.cmd);
  const showFooter = progress > 0.86;

  const totalPackets = Math.max(1, Math.floor(progress * 9999));

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative experience-container"
      style={{ height: "700vh", background: "var(--surface-2)" }}
    >
      <div ref={stickyRef} className="h-screen w-full overflow-hidden relative grid-dots">
        {/* header */}
        <div className="absolute top-6 md:top-10 left-6 md:left-12 z-30">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-2 flex items-center gap-3">
            <span className="inline-block h-px w-8 grad-bg" />
            experiência profissional
          </div>
          <h2 className="font-display font-semibold text-2xl md:text-4xl lg:text-5xl text-white tracking-tight">
            <span className="grad-text">Trajetória</span>
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted">
            // traceroute — siga o pacote
          </p>
        </div>

        {/* packet counter */}
        <div className="absolute top-6 md:top-10 right-6 md:right-12 z-30 text-right">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted mb-1">
            packets transmitted
          </div>
          <div className="font-mono text-xl md:text-2xl grad-text font-semibold tabular-nums">
            {String(totalPackets).padStart(4, "0")}
          </div>
        </div>

        <div className="h-full w-full pt-32 md:pt-36 pb-10 px-4 md:px-12 grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 md:gap-8">
          {/* LEFT — terminal */}
          <div className="hidden md:flex flex-col">
            <div
              className="rounded-xl flex-1 flex flex-col overflow-hidden backdrop-blur-md"
              style={{
                border: "1px solid rgba(26, 110, 255, 0.3)",
                background: "rgba(10, 10, 10, 0.92)",
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="font-mono text-[11px] text-muted ml-2 px-2 py-0.5 rounded bg-white/5">
                  network@guilherme:~
                </div>
              </div>
              <pre className="px-5 py-4 font-mono text-[12px] leading-relaxed text-[#00FF41] overflow-y-auto flex-1">
                {TERMINAL_HEADER.map((l, i) => (
                  <div key={`h-${i}`} style={{ color: "#a0aec0" }}>
                    {l}
                  </div>
                ))}
                <div>&nbsp;</div>
                {hopLines.map((l, i) => (
                  <div key={`hop-${i}`} style={{ color: i === hopLines.length - 1 ? "#00FF41" : "#cbd5e1" }}>
                    {l}
                  </div>
                ))}
                {showFooter && (
                  <>
                    <div>&nbsp;</div>
                    {TERMINAL_FOOTER.map((l, i) => (
                      <div key={`f-${i}`} style={{ color: l.includes("Welcome") ? "#00FF41" : "#a0aec0" }}>
                        {l}
                      </div>
                    ))}
                  </>
                )}
                {!showFooter && (
                  <span className="inline-block w-2 h-3 bg-[#1A6EFF] animate-pulse ml-1" />
                )}
              </pre>
            </div>
          </div>

          {/* RIGHT — topology + cards */}
          <div className="relative flex flex-col">
            <div className="relative flex-1 min-h-[300px]">
              <svg
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="ping-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1A6EFF" />
                    <stop offset="100%" stopColor="#00FF41" />
                  </linearGradient>
                  <filter id="trace-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection lines (between consecutive nodes) */}
                {NODE_POS.slice(0, -1).map((from, i) => {
                  const to = NODE_POS[i + 1];
                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  // slight curve
                  const cx = from.x + dx / 2;
                  const cy = from.y + dy / 2 - 30;
                  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
                  return (
                    <path
                      key={`line-${i}`}
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      d={d}
                      fill="none"
                      stroke="url(#ping-grad)"
                      strokeWidth="1.5"
                      style={{
                        opacity: 0.3,
                        strokeDasharray: 800,
                        strokeDashoffset: 800,
                      }}
                    />
                  );
                })}

                {/* Ripples (drawn before nodes so nodes sit on top) */}
                {NODE_POS.map((pos, i) => (
                  <circle
                    key={`ripple-${i}`}
                    ref={(el) => {
                      rippleRefs.current[i] = el;
                    }}
                    cx={pos.x}
                    cy={pos.y}
                    r={8}
                    fill="none"
                    stroke={HOPS[i].color}
                    strokeWidth={1.5}
                    style={{ opacity: 0 }}
                  />
                ))}

                {/* Ping packets (one per segment, indexed by destination node) */}
                {NODE_POS.map((_, i) => (
                  <circle
                    key={`ping-${i}`}
                    ref={(el) => {
                      pingRefs.current[i] = el;
                    }}
                    cx={NODE_POS[i].x}
                    cy={NODE_POS[i].y}
                    r={4}
                    fill="url(#ping-grad)"
                    filter="url(#trace-glow)"
                    style={{ opacity: 0 }}
                  />
                ))}

                {/* Nodes */}
                {NODE_POS.map((pos, i) => (
                  <g
                    key={`node-${i}`}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    transform={`translate(${pos.x} ${pos.y}) scale(0.6)`}
                    filter="url(#trace-glow)"
                    style={{
                      opacity: 0,
                      transformOrigin: "center",
                      transformBox: "fill-box",
                      willChange: "transform, opacity",
                    }}
                  >
                    <circle r={28} fill="#0a0a0a" stroke={HOPS[i].color} strokeWidth={1} opacity={0.4} />
                    <NodeIcon kind={HOPS[i].id} color={HOPS[i].color} />
                  </g>
                ))}

                {/* Labels */}
                {NODE_POS.map((pos, i) => (
                  <text
                    key={`lbl-${i}`}
                    x={pos.x}
                    y={pos.y + 50}
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono"
                    fontSize="10"
                    fill="#a0aec0"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {HOPS[i].label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Cards row (below topology) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {HOPS.filter((h) => h.card).map((hop, i) => {
                const realIdx = HOPS.findIndex((h) => h.id === hop.id);
                return (
                  <div
                    key={hop.id}
                    ref={(el) => {
                      cardRefs.current[realIdx] = el;
                    }}
                    className="grad-border glass rounded-xl p-3.5 backdrop-blur-md"
                    style={{
                      background: "rgba(10,10,10,0.88)",
                      opacity: 0,
                      transform: "translateX(60px)",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div
                      className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1"
                      style={{ color: hop.color }}
                    >
                      {hop.card!.badge} · {hop.card!.period}
                    </div>
                    <h3 className="font-display font-semibold text-sm md:text-base text-white tracking-tight mb-1.5 leading-snug">
                      {hop.card!.title}
                    </h3>
                    <p className="text-muted text-[11px] leading-relaxed mb-2">
                      {hop.card!.body}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hop.card!.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[8.5px] tracking-wide px-1.5 py-0.5 rounded-full bg-white/5 text-white/80 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* placeholder for unused index 0 (origin has no card) */}
              <div
                ref={(el) => {
                  cardRefs.current[0] = el;
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* bottom hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
          scroll para transmitir o pacote ↓
        </div>
      </div>
    </section>
  );
}
