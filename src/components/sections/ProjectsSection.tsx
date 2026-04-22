import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type ProjectDef = {
  slug: string;
  number: string;
  name: string;
  title: string;
  description: string;
  stack: string[];
  diagramKind: "firewall" | "scraper" | "crud";
  repoUrl: string;
};

const PROJECTS: ProjectDef[] = [
  {
    slug: "firewall-automation",
    number: "01",
    name: "firewall-automation",
    title: "Firewall Automático",
    description:
      "Script em Shell para automação de regras de firewall com IPTables e UFW. Controle de portas, bloqueio de IPs e configuração de políticas de segurança de rede.",
    stack: ["Shell", "Linux", "IPTables", "UFW"],
    diagramKind: "firewall",
    repoUrl: "https://github.com/GuilhermeGms3/firewall-automation",
  },
  {
    slug: "Impressora_Xerox",
    number: "02",
    name: "impressora-xerox",
    title: "Scraper para PowerBI",
    description:
      "Coleta de dados de impressoras Xerox em Python com integração a dashboards PowerBI: contadores, alertas de toner e métricas de uso por departamento.",
    stack: ["Python", "Web Scraping", "PowerBI", "Pandas"],
    diagramKind: "scraper",
    repoUrl: "https://github.com/GuilhermeGms3/Impressora_Xerox",
  },
  {
    slug: "Crud-em-java",
    number: "03",
    name: "crud-app",
    title: "CRUD Full Stack",
    description:
      "Aplicação CRUD com camada REST completa: criação, leitura, atualização e remoção de registros, com validação, paginação e arquitetura modular.",
    stack: ["JavaScript", "Node.js", "REST API", "CRUD"],
    diagramKind: "crud",
    repoUrl: "https://github.com/GuilhermeGms3/Crud-em-java",
  },
];

/* ───────── Diagrams ───────── */

function FirewallDiagram() {
  return (
    <svg viewBox="0 0 520 280" className="w-full h-auto">
      <defs>
        <linearGradient id="fwGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
        <marker id="fwArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#00FF41" />
        </marker>
      </defs>
      {/* internet cloud */}
      <ellipse cx="70" cy="140" rx="50" ry="32" fill="rgba(255,255,255,0.03)" stroke="#1A6EFF" strokeWidth="1.2" className="proj-line" />
      <text x="70" y="145" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="11" fill="#a0aec0">internet</text>

      {/* firewall */}
      <rect x="210" y="100" width="100" height="80" rx="8" fill="rgba(26,110,255,0.06)" stroke="url(#fwGrad)" strokeWidth="1.5" className="proj-line" />
      <text x="260" y="138" textAnchor="middle" fontFamily="Space Grotesk" fontSize="14" fontWeight="600" fill="#ffffff">FIREWALL</text>
      <text x="260" y="156" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#a0aec0">iptables · ufw</text>

      {/* line cloud → firewall */}
      <line x1="120" y1="140" x2="210" y2="140" stroke="url(#fwGrad)" strokeWidth="1.5" markerEnd="url(#fwArrow)" className="proj-line" strokeDasharray="100" strokeDashoffset="100" />

      {/* servers */}
      {[60, 140, 220].map((y, i) => (
        <g key={i}>
          <rect x={400} y={y - 12} width="90" height="34" rx="6" fill="rgba(0,255,65,0.05)" stroke="#00FF41" strokeWidth="1" className="proj-line" />
          <text x="445" y={y + 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#a0aec0">node_{i + 1}</text>
          <line x1="310" y1="140" x2="400" y2={y + 5} stroke="url(#fwGrad)" strokeWidth="1" className="proj-line" strokeDasharray="120" strokeDashoffset="120" />
        </g>
      ))}

      {/* blocked ports */}
      <g className="proj-x" opacity="0">
        <text x="160" y="92" fontFamily="IBM Plex Mono" fontSize="13" fill="#ff5555">✕ :22</text>
        <text x="160" y="200" fontFamily="IBM Plex Mono" fontSize="13" fill="#ff5555">✕ :3389</text>
      </g>
      <g className="proj-check" opacity="0">
        <text x="340" y="80" fontFamily="IBM Plex Mono" fontSize="13" fill="#00FF41">✓ :443</text>
        <text x="340" y="220" fontFamily="IBM Plex Mono" fontSize="13" fill="#00FF41">✓ :80</text>
      </g>
    </svg>
  );
}

function ScraperDiagram() {
  return (
    <svg viewBox="0 0 520 200" className="w-full h-auto">
      <defs>
        <linearGradient id="scGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
        <marker id="scArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#00FF41" />
        </marker>
      </defs>
      {[
        { x: 10, label: "Xerox", sub: "printer api" },
        { x: 145, label: "Python", sub: "scraper" },
        { x: 280, label: "DataFrame", sub: "pandas" },
        { x: 415, label: "PowerBI", sub: "dashboard" },
      ].map((n, i, arr) => (
        <g key={n.label}>
          <rect x={n.x} y={70} width="95" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="url(#scGrad)" strokeWidth="1.2" className="proj-line" />
          <text x={n.x + 47.5} y={94} textAnchor="middle" fontFamily="Space Grotesk" fontSize="13" fontWeight="600" fill="#ffffff">{n.label}</text>
          <text x={n.x + 47.5} y={112} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#a0aec0">{n.sub}</text>
          {i < arr.length - 1 && (
            <line
              x1={n.x + 95} y1="100" x2={arr[i + 1].x} y2="100"
              stroke="url(#scGrad)" strokeWidth="1.5" markerEnd="url(#scArrow)"
              className="proj-line" strokeDasharray="50" strokeDashoffset="50"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function CrudDiagram() {
  return (
    <svg viewBox="0 0 520 220" className="w-full h-auto">
      <defs>
        <linearGradient id="cGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
      </defs>
      {[
        { x: 20, label: "Frontend", sub: "client" },
        { x: 200, label: "REST API", sub: "node.js" },
        { x: 380, label: "Database", sub: "store" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={80} width="120" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="url(#cGrad)" strokeWidth="1.3" className="proj-line" />
          <text x={n.x + 60} y={104} textAnchor="middle" fontFamily="Space Grotesk" fontSize="14" fontWeight="600" fill="#ffffff">{n.label}</text>
          <text x={n.x + 60} y={122} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#a0aec0">{n.sub}</text>
        </g>
      ))}
      {/* arrows with CRUD labels */}
      {[
        { x1: 140, x2: 200, label: "POST · GET", y: 100 },
        { x1: 320, x2: 380, label: "PUT · DELETE", y: 100 },
      ].map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} stroke="url(#cGrad)" strokeWidth="1.5" className="proj-line" strokeDasharray="60" strokeDashoffset="60" />
          <text x={(a.x1 + a.x2) / 2} y={a.y - 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#a0aec0">{a.label}</text>
        </g>
      ))}
      {/* CRUD ops */}
      <g>
        {["CREATE", "READ", "UPDATE", "DELETE"].map((op, i) => (
          <text
            key={op} x={20 + i * 130} y={180}
            fontFamily="IBM Plex Mono" fontSize="10" fill="#1A6EFF"
            className="proj-line" opacity="0"
          >
            • {op}
          </text>
        ))}
      </g>
    </svg>
  );
}

function Diagram({ kind }: { kind: ProjectDef["diagramKind"] }) {
  if (kind === "firewall") return <FirewallDiagram />;
  if (kind === "scraper") return <ScraperDiagram />;
  return <CrudDiagram />;
}

/* ───────── Project scene ───────── */

function ProjectScene({ project, repoData }: { project: ProjectDef; repoData?: RepoData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 1: number 0→0.35 (slides in then dims)
          if (numberRef.current) {
            const enter = clamp(p / 0.15);
            const dim = clamp((p - 0.2) / 0.15);
            numberRef.current.style.transform = `translateX(${(1 - enter) * -200}px)`;
            numberRef.current.style.opacity = String(enter * (1 - dim * 0.92));
          }
          if (titleRef.current) {
            const t = clamp((p - 0.1) / 0.2);
            titleRef.current.style.transform = `translateY(${(1 - t) * 40}px)`;
            titleRef.current.style.opacity = String(t);
          }

          // Phase 2: diagram 0.35→0.7
          if (diagramRef.current) {
            const dp = clamp((p - 0.35) / 0.35);
            diagramRef.current.style.opacity = String(Math.min(1, dp * 1.8));
            const lines = diagramRef.current.querySelectorAll<SVGElement>(".proj-line");
            lines.forEach((el, i) => {
              const start = (i / lines.length) * 0.6;
              const lp = clamp((dp - start) / 0.4);
              const path = el as SVGPathElement;
              if (path.getTotalLength) {
                try {
                  const len = path.getTotalLength();
                  path.style.strokeDasharray = `${len}`;
                  path.style.strokeDashoffset = `${len * (1 - lp)}`;
                  el.style.opacity = String(Math.min(1, lp * 1.5));
                } catch {
                  el.style.opacity = String(lp);
                }
              } else {
                el.style.opacity = String(lp);
              }
            });
            const xs = diagramRef.current.querySelectorAll<SVGElement>(".proj-x, .proj-check");
            xs.forEach((el) => {
              el.style.opacity = String(clamp((dp - 0.7) / 0.3));
            });
          }

          // Phase 3: description 0.7→1
          if (descRef.current) {
            const dp = clamp((p - 0.7) / 0.25);
            descRef.current.style.opacity = String(dp);
            descRef.current.style.transform = `translateY(${(1 - dp) * 40}px)`;
          }
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div ref={stickyRef} className="h-screen w-full overflow-hidden flex items-center px-6 md:px-12 relative grid-lines">
        {/* huge background number */}
        <div
          ref={numberRef}
          className="absolute inset-0 flex items-center justify-start pl-6 md:pl-16 font-display font-bold text-[28vw] md:text-[22vw] leading-none text-white pointer-events-none select-none"
          style={{ willChange: "transform, opacity", letterSpacing: "-0.05em" }}
        >
          {project.number}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT: title + diagram */}
          <div className="space-y-8">
            <div ref={titleRef} style={{ willChange: "transform, opacity" }}>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
                <span className="inline-block h-px w-8 grad-bg" />
                project · {project.number}
              </div>
              <h3 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight mb-2">
                {project.title}
              </h3>
              <div className="font-mono text-sm grad-text">{project.name}</div>
            </div>

            <div
              ref={diagramRef}
              className="grad-border glass rounded-xl p-6 md:p-8"
              style={{ opacity: 0 }}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-4">
                // architecture
              </div>
              <Diagram kind={project.diagramKind} />
            </div>
          </div>

          {/* RIGHT: description */}
          <div ref={descRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
            <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8">
              {repoData?.description ?? project.description}
            </p>

            {(repoData?.stargazers_count != null || repoData?.language) && (
              <div className="flex items-center gap-5 mb-6 font-mono text-xs text-muted">
                {repoData?.stargazers_count != null && (
                  <span>★ {repoData.stargazers_count}</span>
                )}
                {repoData?.language && <span>{repoData.language}</span>}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="grad-border rounded-full font-mono text-xs text-white px-4 py-1.5 bg-black/30"
                >
                  {t}
                </span>
              ))}
            </div>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={repoData?.html_url ?? project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="grad-border inline-flex items-center gap-2 px-5 py-3 rounded-md text-white font-display tracking-tight bg-black/30"
            >
              Ver Repositório
              <span aria-hidden>→</span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectTransition() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="py-16 px-6 md:px-12 relative">
      <div className="mx-auto max-w-6xl">
        <div className="h-px w-full grad-bg opacity-60" />
        <div className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-muted text-center">
          loading next project
        </div>
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

type RepoData = {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
};

export function ProjectsSection() {
  const [repos, setRepos] = useState<Record<string, RepoData>>({});

  useEffect(() => {
    let active = true;
    fetch("https://api.github.com/users/GuilhermeGms3/repos?per_page=100")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: RepoData[]) => {
        if (!active || !Array.isArray(data)) return;
        const map: Record<string, RepoData> = {};
        for (const r of data) map[r.name.toLowerCase()] = r;
        setRepos(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="projects" className="relative" style={{ background: "var(--surface-1)" }}>
      <div className="px-6 md:px-12 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          trabalho selecionado
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight">
          <span className="grad-text">Projetos</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Três projetos que representam minha forma de pensar e construir.
        </p>
      </div>

      {PROJECTS.map((p, i) => (
        <div key={p.slug}>
          <ProjectScene project={p} repoData={repos[p.slug.toLowerCase()]} />
          {i < PROJECTS.length - 1 && <ProjectTransition />}
        </div>
      ))}
    </section>
  );
}
