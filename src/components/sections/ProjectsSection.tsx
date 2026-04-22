import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProjectDef = {
  slug: string;
  name: string;
  command: string;
  outputs: string[];
  description: string;
  stack: string[];
  diagramKind: "firewall" | "scraper" | "crud";
  repoUrl: string;
};

const PROJECTS: ProjectDef[] = [
  {
    slug: "firewall-automation",
    name: "firewall-automation",
    command: "$ sudo bash firewall-auto.sh --mode production",
    outputs: [
      "[INFO]  loading ruleset from /etc/firewall/base.rules",
      "[INFO]  flushing existing chains",
      "RULE ADDED: DROP  port 22  from 0.0.0.0/0",
      "RULE ADDED: ACCEPT port 443 from 0.0.0.0/0",
      "RULE ADDED: DROP  port 3389 from 0.0.0.0/0",
      "[ OK ]  ufw enabled, persistent rules saved",
    ],
    description:
      "Sistema de automação de firewall em Shell Script com integração IPTables/UFW. Aplica políticas de segurança em servidores Linux de forma idempotente, com logging e rollback.",
    stack: ["Shell", "IPTables", "UFW", "Linux"],
    diagramKind: "firewall",
    repoUrl: "https://github.com/GuilhermeGms3/firewall-automation",
  },
  {
    slug: "Impressora_Xerox",
    name: "impressora-xerox",
    command: "$ python3 scraper.py --target xerox --export powerbi",
    outputs: [
      "[INFO]  starting headless session",
      "[INFO]  authenticating against printer dashboard",
      "[INFO]  scraping counters: 1,247 pages",
      "[INFO]  normalizing dataset",
      "[ OK ]  exported to PowerBI dataflow",
    ],
    description:
      "Scraper em Python que coleta dados de impressoras Xerox e integra com o PowerBI para dashboards de consumo, alertas de toner e métricas de uso por departamento.",
    stack: ["Python", "Web Scraping", "PowerBI", "Pandas"],
    diagramKind: "scraper",
    repoUrl: "https://github.com/GuilhermeGms3/Impressora_Xerox",
  },
  {
    slug: "Crud-em-java",
    name: "crud-app",
    command: "$ node server.js",
    outputs: [
      "[INFO]  loading routes /api/users",
      "[INFO]  connecting to datastore",
      "[ OK ]  server listening on http://localhost:3000",
      "GET  /api/users    200  12ms",
      "POST /api/users    201  18ms",
      "PUT  /api/users/3  200  9ms",
    ],
    description:
      "Aplicação CRUD com camada REST completa: criação, leitura, atualização e remoção de registros, com validação, paginação e arquitetura modular.",
    stack: ["JavaScript", "Node.js", "CRUD", "REST API"],
    diagramKind: "crud",
    repoUrl: "https://github.com/GuilhermeGms3/Crud-em-java",
  },
];

function FirewallDiagram() {
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="rgb(0,255,65)" />
        </marker>
      </defs>
      {/* clients */}
      {[40, 90, 140].map((y, i) => (
        <g key={i}>
          <rect x="20" y={y - 12} width="60" height="24" rx="2" fill="none" stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" />
          <text x="50" y={y + 4} textAnchor="middle" fontFamily="Share Tech Mono" fontSize="10" fill="rgb(0,255,65)">client_{i + 1}</text>
        </g>
      ))}
      {/* lines to firewall */}
      {[40, 90, 140].map((y, i) => (
        <line key={i} x1="80" y1={y} x2="170" y2="120" stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" strokeDasharray="200" strokeDashoffset="200" />
      ))}
      {/* firewall */}
      <rect x="170" y="90" width="80" height="60" fill="rgb(0,255,65,0.06)" stroke="rgb(0,255,65)" strokeWidth="1.5" className="diag-line glow-box" />
      <text x="210" y="118" textAnchor="middle" fontFamily="Share Tech Mono" fontSize="11" fill="rgb(0,255,65)">FIREWALL</text>
      <text x="210" y="134" textAnchor="middle" fontFamily="Share Tech Mono" fontSize="9" fill="rgb(0,255,65,0.7)">iptables</text>
      {/* server */}
      <line x1="250" y1="120" x2="320" y2="120" stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" markerEnd="url(#arrow)" />
      <rect x="320" y="100" width="60" height="40" fill="none" stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" />
      <text x="350" y="124" textAnchor="middle" fontFamily="Share Tech Mono" fontSize="10" fill="rgb(0,255,65)">server</text>
      {/* blocked X */}
      <g className="diag-x" opacity="0">
        <text x="125" y="46" fontSize="18" fill="#ff3b3b" fontFamily="monospace">✕</text>
        <text x="125" y="146" fontSize="18" fill="#ff3b3b" fontFamily="monospace">✕</text>
      </g>
    </svg>
  );
}

function ScraperDiagram() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {[
        { x: 20, label: "scraper.py" },
        { x: 150, label: "dataset.csv" },
        { x: 280, label: "PowerBI" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={80} width="100" height="40" fill="rgb(0,255,65,0.05)" stroke="rgb(0,255,65)" strokeWidth="1.2" className="diag-line" />
          <text x={n.x + 50} y={104} textAnchor="middle" fontFamily="Share Tech Mono" fontSize="11" fill="rgb(0,255,65)">{n.label}</text>
        </g>
      ))}
      <line x1="120" y1="100" x2="150" y2="100" stroke="rgb(0,255,65)" strokeWidth="1.2" className="diag-line" />
      <line x1="250" y1="100" x2="280" y2="100" stroke="rgb(0,255,65)" strokeWidth="1.2" className="diag-line" />
      {[60, 180, 305].map((x, i) => (
        <text key={i} x={x} y={150} fontFamily="Share Tech Mono" fontSize="8" fill="rgb(0,255,65,0.6)" textAnchor="middle">
          {i === 0 ? "extract" : i === 1 ? "transform" : "load"}
        </text>
      ))}
    </svg>
  );
}

function CrudDiagram() {
  const ops = ["CREATE", "READ", "UPDATE", "DELETE"];
  return (
    <svg viewBox="0 0 400 220" className="w-full h-auto">
      <circle cx="200" cy="110" r="40" fill="rgb(0,255,65,0.08)" stroke="rgb(0,255,65)" strokeWidth="1.5" className="diag-line glow-box" />
      <text x="200" y="115" textAnchor="middle" fontFamily="Share Tech Mono" fontSize="12" fill="rgb(0,255,65)">API</text>
      {ops.map((op, i) => {
        const angle = (i / ops.length) * Math.PI * 2 - Math.PI / 2;
        const x = 200 + Math.cos(angle) * 120;
        const y = 110 + Math.sin(angle) * 80;
        return (
          <g key={op}>
            <line x1="200" y1="110" x2={x} y2={y} stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" />
            <rect x={x - 32} y={y - 12} width="64" height="24" fill="rgb(10,10,10)" stroke="rgb(0,255,65)" strokeWidth="1" className="diag-line" />
            <text x={x} y={y + 4} textAnchor="middle" fontFamily="Share Tech Mono" fontSize="10" fill="rgb(0,255,65)">{op}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Diagram({ kind }: { kind: ProjectDef["diagramKind"] }) {
  if (kind === "firewall") return <FirewallDiagram />;
  if (kind === "scraper") return <ScraperDiagram />;
  return <CrudDiagram />;
}

function ProjectScene({ project, index, repoData }: { project: ProjectDef; index: number; repoData?: RepoData }) {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [typedLines, setTypedLines] = useState(0);

  useEffect(() => {
    if (!ref.current || !stickyRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
      });

      // Phase 1: terminal text appears (0-0.4)
      const lines = project.outputs.length + 1; // command + outputs
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Phase 1
          if (p <= 0.4) {
            const n = Math.floor((p / 0.4) * lines);
            setTypedLines(n);
          } else {
            setTypedLines(lines);
          }
          // Phase 2 diagram lines
          if (diagramRef.current) {
            const lines = diagramRef.current.querySelectorAll(".diag-line");
            const xs = diagramRef.current.querySelectorAll(".diag-x");
            const dp = Math.max(0, Math.min(1, (p - 0.35) / 0.35));
            lines.forEach((el) => {
              (el as SVGElement).style.opacity = String(dp);
              const path = el as SVGPathElement;
              if (path.getTotalLength) {
                try {
                  const len = path.getTotalLength();
                  path.style.strokeDasharray = `${len}`;
                  path.style.strokeDashoffset = `${len * (1 - dp)}`;
                } catch {}
              }
            });
            xs.forEach((el) => {
              (el as SVGElement).style.opacity = String(Math.max(0, (p - 0.6) / 0.1));
            });
          }
          // Phase 3 description
          if (descRef.current) {
            const dp = Math.max(0, Math.min(1, (p - 0.7) / 0.25));
            descRef.current.style.opacity = String(dp);
            descRef.current.style.transform = `translateY(${(1 - dp) * 30}px)`;
          }
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={ref} className="relative" style={{ height: "300vh" }}>
      <div ref={stickyRef} className="h-screen w-full flex items-center justify-center px-6 md:px-12">
        <div className="mx-auto max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* LEFT: terminal + diagram */}
          <div className="space-y-6">
            <div ref={terminalRef} className="terminal-pane scanlines">
              <div className="flex items-center justify-between border-b border-terminal/40 px-4 py-2 bg-terminal/5">
                <span className="font-terminal text-xs text-terminal/70">~ /projects/{project.slug}</span>
                <span className="font-terminal text-xs text-terminal/40">[{String(index + 1).padStart(2, "0")}/03]</span>
              </div>
              <div className="p-4 md:p-5 font-terminal text-xs md:text-sm min-h-[220px]">
                <div className="text-terminal glow-text mb-2">{project.command}</div>
                {project.outputs.slice(0, Math.max(0, typedLines - 1)).map((line, i) => (
                  <div key={i} className="text-terminal/80">
                    {line}
                  </div>
                ))}
                {typedLines > 0 && typedLines <= project.outputs.length && (
                  <div className="text-terminal blink-caret" />
                )}
              </div>
            </div>

            <div ref={diagramRef} className="terminal-pane scanlines p-4 md:p-6">
              <div className="font-terminal text-xs text-terminal/60 mb-3">// topology.svg</div>
              <Diagram kind={project.diagramKind} />
            </div>
          </div>

          {/* RIGHT: description */}
          <div ref={descRef} style={{ opacity: 0 }}>
            <div className="font-terminal text-xs text-terminal/60 mb-2">
              [{String(index + 1).padStart(2, "0")}] // featured project
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-terminal-bright glow-text-strong mb-4">
              {project.name}
            </h3>
            <div className="font-terminal text-sm text-terminal/70 mb-6">
              {repoData?.stargazers_count != null && (
                <span className="mr-4">★ {repoData.stargazers_count}</span>
              )}
              {repoData?.language && <span>lang: {repoData.language}</span>}
            </div>
            <p className="text-foreground/85 leading-relaxed mb-6">
              {repoData?.description ?? project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="font-terminal text-xs text-terminal border border-terminal/40 px-3 py-1 bg-terminal/5"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={repoData?.html_url ?? project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-terminal px-5 py-2.5 font-terminal text-terminal hover:bg-terminal hover:text-background transition-colors glow-box-sm"
            >
              <span className="text-terminal/60 group-hover:text-background/70">$</span>
              ./ver_repositorio →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectTransition({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { backgroundPosition: "200% 0%" },
        {
          backgroundPosition: "-200% 0%",
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={ref}
      className="py-12 px-6 md:px-12 border-y border-terminal/15 font-terminal text-terminal/70 text-sm md:text-base text-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(0,255,65,0.06), transparent)",
        backgroundSize: "200% 100%",
      }}
    >
      <span className="text-terminal/50">&gt;</span> loading next project... <span className="text-terminal-bright glow-text">{label}</span>
    </div>
  );
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
    <section id="projects" className="relative border-b border-terminal/15">
      <div className="px-6 md:px-12 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="font-terminal text-sm text-terminal/70 mb-3">
          guilherme@portfolio:~$
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-terminal-bright glow-text-strong">
          &gt; ls -la /projects
        </h2>
        <div className="font-terminal text-xs text-terminal/50 mt-3">
          total 3 — featured · sorted by relevance
        </div>
      </div>

      {PROJECTS.map((p, i) => (
        <div key={p.slug}>
          <ProjectScene
            project={p}
            index={i}
            repoData={repos[p.slug.toLowerCase()]}
          />
          {i < PROJECTS.length - 1 && (
            <ProjectTransition label={PROJECTS[i + 1].name} />
          )}
        </div>
      ))}
    </section>
  );
}
