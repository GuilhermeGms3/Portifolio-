import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Tool = {
  name: string;
  tag: string;
  abbr: string;
  /** color hint for the icon badge gradient */
  tone?: "blue" | "green" | "mix";
};

type Group = {
  title: string;
  subtitle: string;
  tools: Tool[];
};

const GROUPS: Group[] = [
  {
    title: "NOC & Monitoramento",
    subtitle: "observabilidade · análise",
    tools: [
      { name: "Grafana", tag: "dashboards", abbr: "Gf", tone: "mix" },
      { name: "Zabbix", tag: "monitoring", abbr: "Zb", tone: "blue" },
      { name: "Prometheus", tag: "metrics", abbr: "Pr", tone: "blue" },
      { name: "Reverse Proxy", tag: "Nginx · HAProxy", abbr: "Rp", tone: "blue" },
      { name: "Pentest", tag: "análise de rede", abbr: "Pt", tone: "green" },
    ],
  },
  {
    title: "DevOps & Infraestrutura",
    subtitle: "pipelines · containers · cloud",
    tools: [
      { name: "CI/CD", tag: "GitHub Actions", abbr: "Ci", tone: "blue" },
      { name: "Docker", tag: "containers", abbr: "Dk", tone: "blue" },
      { name: "Kubernetes", tag: "orchestration", abbr: "K8", tone: "blue" },
      { name: "Terraform", tag: "infra as code", abbr: "Tf", tone: "mix" },
      { name: "SSH & VPN", tag: "tunneling", abbr: "Sh", tone: "green" },
      { name: "Git & GitHub", tag: "version control", abbr: "Gh", tone: "mix" },
    ],
  },
  {
    title: "Development",
    subtitle: "código · aplicações · APIs",
    tools: [
      { name: "Python", tag: "Django · Flask · FastAPI", abbr: "Py", tone: "green" },
      { name: "TypeScript", tag: "type-safe JS", abbr: "Ts", tone: "blue" },
      { name: "Java Spring Boot", tag: "enterprise apps", abbr: "Jv", tone: "green" },
      { name: "React", tag: "frontend SPA", abbr: "Rx", tone: "blue" },
      { name: "REST API", tag: "integrations", abbr: "Ap", tone: "mix" },
    ],
  },
];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="tool-card group relative grad-border glass rounded-xl p-5 flex items-center gap-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        willChange: "transform",
      }}
      data-card-index={index}
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          background:
            tool.tone === "green"
              ? "radial-gradient(circle, #00FF41 0%, transparent 70%)"
              : tool.tone === "blue"
                ? "radial-gradient(circle, #1A6EFF 0%, transparent 70%)"
                : "radial-gradient(circle, #1A6EFF 0%, #00FF41 80%, transparent 100%)",
        }}
      />

      {/* icon badge */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative shrink-0 h-12 w-12 rounded-lg flex items-center justify-center font-mono text-sm font-semibold text-white"
        style={{
          background:
            tool.tone === "green"
              ? "linear-gradient(135deg, rgba(0,255,65,0.25), rgba(0,255,65,0.05))"
              : tool.tone === "blue"
                ? "linear-gradient(135deg, rgba(26,110,255,0.3), rgba(26,110,255,0.05))"
                : "linear-gradient(135deg, rgba(26,110,255,0.3), rgba(0,255,65,0.2))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 0 12px rgba(255,255,255,0.04)",
        }}
      >
        {tool.abbr}
      </motion.div>

      <div className="min-w-0 flex-1">
        <div className="font-mono text-[15px] text-white truncate">{tool.name}</div>
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mt-0.5 truncate">
          {tool.tag}
        </div>
      </div>
    </motion.div>
  );
}

function SkillGroup({ group, groupIndex }: { group: Group; groupIndex: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const cards = rootRef.current!.querySelectorAll<HTMLElement>(".tool-card");
      cards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -60 : 60;
        gsap.fromTo(
          card,
          { x: fromX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.225 + groupIndex * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [groupIndex]);

  return (
    <div ref={rootRef} className="mb-14 last:mb-0">
      <div className="mb-6 flex items-baseline gap-4">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          {group.subtitle}
        </div>
      </div>
      <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight mb-7">
        {group.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {group.tools.map((t, i) => (
          <ToolCard key={t.name} tool={t} index={i} />
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 px-6 md:px-12 grid-dots"
      style={{ background: "var(--surface-2)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          expertise
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-12 max-w-3xl">
          Stack &amp; <span className="grad-text">Habilidades</span>
        </h2>

        {GROUPS.map((g, i) => (
          <SkillGroup key={g.title} group={g} groupIndex={i} />
        ))}
      </div>
    </section>
  );
}
