import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type Stop = {
  id: string;
  pct: number; // position along path
  label: string;
  period: string;
  title: string;
  body: string;
  tags: string[];
  accent: "blue" | "blueCyan" | "mix" | "green";
};

const STOPS: Stop[] = [
  {
    id: "origin",
    pct: 0,
    label: "ORIGEM",
    period: "Início",
    title: "Formação & Primeiros Passos",
    body: "Início da jornada em tecnologia, estudos em infraestrutura de redes, sistemas operacionais Linux e fundamentos de TI.",
    tags: ["Formação", "Linux", "Redes"],
    accent: "blue",
  },
  {
    id: "hop1",
    pct: 0.33,
    label: "HOP 01 — SERVICE DESK N2",
    period: "Janeiro 2024 — Dezembro 2025",
    title: "Analista Service Desk N2",
    body: "Atendimento e resolução de chamados N2, suporte técnico avançado a usuários e sistemas, diagnóstico de falhas em infraestrutura, escalonamento e gestão de incidentes críticos. Atuação com ferramentas de monitoramento e ticketing em ambiente corporativo.",
    tags: ["N2 Support", "Incident Management", "Infra"],
    accent: "blueCyan",
  },
  {
    id: "hop2",
    pct: 0.66,
    label: "HOP 02 — DEVOPS & AUTOMAÇÃO",
    period: "Em desenvolvimento",
    title: "DevOps & Automação",
    body: "Evolução para práticas DevOps: automação com Shell Script e Python, implementação de pipelines CI/CD, containers Docker, orquestração Kubernetes, infraestrutura como código com Terraform e gestão de ambientes com Grafana, Zabbix e Prometheus.",
    tags: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    accent: "mix",
  },
  {
    id: "destination",
    pct: 1,
    label: "DESTINATION — FULL STACK",
    period: "Presente & Futuro",
    title: "Full Stack Developer + DevOps",
    body: "Integração completa entre infraestrutura e desenvolvimento. Projetos em Python, TypeScript, Java Spring Boot e React. Disponível para freelas e oportunidades que conectem as duas áreas.",
    tags: ["Python", "TypeScript", "React", "Full Stack"],
    accent: "green",
  },
];

const ACCENT_COLOR: Record<Stop["accent"], string> = {
  blue: "#1A6EFF",
  blueCyan: "#00D4FF",
  mix: "#1A6EFF",
  green: "#00FF41",
};

// SVG path for the network route — diagonal organic flow.
// viewBox: 0 0 1200 600
const NETWORK_PATH =
  "M 40 480 L 180 480 C 240 480 260 380 320 380 L 460 380 C 520 380 540 280 600 280 L 740 280 C 800 280 820 200 880 200 L 1020 200 C 1080 200 1100 130 1160 130";

// Helper: get point on path at pct (approx, using SVG getPointAtLength)
function getNodePos(pathEl: SVGPathElement, pct: number) {
  const len = pathEl.getTotalLength();
  return pathEl.getPointAtLength(len * pct);
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const flashRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [packetCount, setPacketCount] = useState(1);
  const [nodePositions, setNodePositions] = useState<Array<{ x: number; y: number }>>([]);
  const [pathLen, setPathLen] = useState(0);

  // Compute node positions once SVG is mounted
  useEffect(() => {
    if (!pathRef.current) return;
    const positions = STOPS.map((s) => {
      const p = getNodePos(pathRef.current!, s.pct);
      return { x: p.x, y: p.y };
    });
    setNodePositions(positions);
    setPathLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current || !pathRef.current || !packetRef.current) return;
    if (nodePositions.length === 0) return;

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const scrubVal = isMobile ? 2.5 : 5;

    const ctx = gsap.context(() => {
      // Packet travels along the path
      gsap.to(packetRef.current, {
        motionPath: {
          path: pathRef.current!,
          align: pathRef.current!,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: scrubVal,
          pin: stickyRef.current,
          pinSpacing: false,
        },
      });

      // Reveal each card / pulse each node when scroll progress reaches its pct
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: scrubVal,
        onUpdate: (self) => {
          const p = self.progress;
          STOPS.forEach((stop, i) => {
            const card = cardRefs.current[i];
            const node = nodeRefs.current[i];
            const flash = flashRefs.current[i];
            // Reveal threshold: when scroll passes the stop's pct minus a small lead
            const lead = 0.04;
            const triggerAt = Math.max(0, stop.pct - lead);
            const t = Math.max(0, Math.min(1, (p - triggerAt) / 0.08));
            if (card) {
              card.style.opacity = String(t);
              card.style.transform = `translateY(${(1 - t) * 30}px)`;
            }
            if (node) {
              const scale = 1 + Math.sin(t * Math.PI) * 0.5;
              const opacity = 0.55 + t * 0.45;
              node.setAttribute("transform", `translate(${nodePositions[i].x} ${nodePositions[i].y}) scale(${scale})`);
              node.style.opacity = String(opacity);
            }
            if (flash) {
              const fadeT = Math.max(0, Math.min(1, (p - stop.pct) / 0.05));
              const fadeOut = Math.max(0, Math.min(1, (p - stop.pct - 0.05) / 0.05));
              flash.style.opacity = String(Math.max(0, fadeT - fadeOut));
            }
          });

          // packet counter
          setPacketCount(Math.max(1, Math.floor(p * 9999)));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [nodePositions]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative experience-container"
      style={{ height: "500vh", background: "var(--surface-2)" }}
    >
      <div
        ref={stickyRef}
        className="h-screen w-full overflow-hidden relative grid-dots"
      >
        {/* header */}
        <div className="absolute top-8 md:top-12 left-6 md:left-12 z-20">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
            <span className="inline-block h-px w-8 grad-bg" />
            experiência profissional
          </div>
          <h2 className="font-display font-semibold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight">
            <span className="grad-text">Trajetória</span>
          </h2>
          <p className="mt-2 font-mono text-xs text-muted">
            // a jornada de um pacote IP — siga a rota
          </p>
        </div>

        {/* packet counter */}
        <div className="absolute top-8 md:top-12 right-6 md:right-12 z-20 text-right">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-1">
            packets transmitted
          </div>
          <div className="font-mono text-2xl md:text-3xl grad-text font-semibold tabular-nums">
            {String(packetCount).padStart(4, "0")}
          </div>
        </div>

        {/* SVG network path scene */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full max-w-[1400px]"
          >
            <defs>
              <linearGradient id="pkt-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1A6EFF" />
                <stop offset="100%" stopColor="#00FF41" />
              </linearGradient>
              <linearGradient id="path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1A6EFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00FF41" stopOpacity="0.4" />
              </linearGradient>
              <filter id="pkt-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Faint alternative branch routes */}
            <g opacity="0.08" stroke="#1A6EFF" strokeWidth="0.8" fill="none">
              <path d="M 180 480 C 240 480 280 540 360 540 L 500 540" />
              <path d="M 600 280 C 660 280 700 220 760 130 L 880 130" />
              <path d="M 740 280 L 740 380 L 880 380" />
              <path d="M 320 380 L 320 280 L 460 280" />
            </g>

            {/* Drifting binary numbers along path (decorative) */}
            <g opacity="0.06" fill="#1A6EFF" fontFamily="IBM Plex Mono" fontSize="10">
              <text x="100" y="475">01001011</text>
              <text x="380" y="375">11010110</text>
              <text x="660" y="275">00101110</text>
              <text x="940" y="195">10110001</text>
            </g>

            {/* Main network path */}
            <path
              ref={pathRef}
              id="network-path"
              d={NETWORK_PATH}
              fill="none"
              stroke="url(#path-grad)"
              strokeWidth="1.5"
              strokeDasharray={pathLen ? `${pathLen}` : undefined}
            />

            {/* Subtle path glow trail behind packet */}
            <path
              d={NETWORK_PATH}
              fill="none"
              stroke="#1A6EFF"
              strokeWidth="6"
              opacity="0.05"
              filter="url(#pkt-glow)"
            />

            {/* Stop nodes */}
            {nodePositions.map((pos, i) => (
              <g
                key={STOPS[i].id}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                transform={`translate(${pos.x} ${pos.y})`}
                style={{ opacity: 0.55, transformOrigin: "center", willChange: "transform, opacity" }}
                filter="url(#node-glow)"
              >
                <circle r="14" fill="#0a0a0a" stroke={ACCENT_COLOR[STOPS[i].accent]} strokeWidth="1.5" opacity="0.6" />
                <circle r="7" fill={ACCENT_COLOR[STOPS[i].accent]} />
                <circle r="3" fill="#ffffff" opacity="0.9" />
              </g>
            ))}

            {/* Stop labels (small, near each node) */}
            {nodePositions.map((pos, i) => (
              <text
                key={`label-${STOPS[i].id}`}
                x={pos.x}
                y={pos.y - 26}
                textAnchor="middle"
                fontFamily="IBM Plex Mono"
                fontSize="9"
                fill="#a0aec0"
                style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {STOPS[i].label.split(" — ")[0]}
              </text>
            ))}

            {/* The packet (sits at path origin until GSAP MotionPath kicks in) */}
            <g
              ref={packetRef}
              style={{ willChange: "transform" }}
              filter="url(#pkt-glow)"
            >
              <rect
                x="-5"
                y="-5"
                width="10"
                height="10"
                rx="1.5"
                fill="url(#pkt-grad)"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              {/* trailing line */}
              <line
                x1="-80"
                y1="0"
                x2="-5"
                y2="0"
                stroke="url(#pkt-grad)"
                strokeWidth="1.2"
                opacity="0.4"
              />
            </g>
          </svg>
        </div>

        {/* Career cards positioned over each node */}
        <div className="absolute inset-0 pointer-events-none">
          {nodePositions.map((pos, i) => {
            const stop = STOPS[i];
            // alternate cards above/below the node
            const above = i % 2 === 0;
            // Convert SVG coordinates to percentages of the SVG viewport
            const xPct = (pos.x / 1200) * 100;
            const yPct = (pos.y / 600) * 100;

            return (
              <div key={stop.id}>
                {/* "packet received" flash label */}
                <div
                  ref={(el) => {
                    flashRefs.current[i] = el;
                  }}
                  className="absolute font-mono text-[10px] tracking-[0.2em] uppercase grad-text font-semibold whitespace-nowrap"
                  style={{
                    left: `${xPct}%`,
                    top: `calc(${yPct}% + ${above ? "32px" : "-44px"})`,
                    transform: "translateX(-50%)",
                    opacity: 0,
                    willChange: "opacity",
                  }}
                >
                  {`> packet received at NODE_${String(i + 1).padStart(2, "0")}`}
                </div>

                {/* career card */}
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute pointer-events-auto grad-border glass rounded-xl p-4 md:p-5 max-w-[260px] md:max-w-[280px] backdrop-blur-md"
                  style={{
                    left: `${xPct}%`,
                    top: `calc(${yPct}% + ${above ? "60px" : "-100px"})`,
                    transform: "translateX(-50%) translateY(30px)",
                    opacity: 0,
                    willChange: "transform, opacity",
                    background: "rgba(10,10,10,0.85)",
                    borderColor: "transparent",
                  }}
                >
                  <div
                    className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1.5"
                    style={{ color: ACCENT_COLOR[stop.accent] }}
                  >
                    {stop.period}
                  </div>
                  <h3 className="font-display font-semibold text-base md:text-lg text-white tracking-tight mb-2 leading-snug">
                    {stop.title}
                  </h3>
                  <p className="text-muted text-[12px] md:text-[13px] leading-relaxed mb-3">
                    {stop.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-white/5 text-white/80 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* bottom hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
          scroll para transmitir o pacote ↓
        </div>
      </div>
    </section>
  );
}
