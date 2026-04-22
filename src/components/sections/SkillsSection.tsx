import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Tool = {
  name: string;
  tag: string;
  abbr: string;
  tone?: "blue" | "green" | "mix";
};

type Group = {
  title: string;
  subtitle: string;
  filename: string;
  codeLines: string[];
  tools: Tool[];
};

const GROUPS: Group[] = [
  {
    title: "NOC & Monitoramento",
    subtitle: "observabilidade · análise",
    filename: "noc-stack.config",
    codeLines: [
      "// NOC & Monitoramento",
      "const stack = {",
      '  monitoring: ["Grafana", "Zabbix", "Prometheus"],',
      '  security:   ["Reverse Proxy", "Pentest"],',
      "}",
      "> compiling...",
      "> dependencies resolved ✓",
      "> stack loaded ✓",
    ],
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
    filename: "devops.yaml",
    codeLines: [
      "# devops.yaml",
      "ci_cd:",
      "  - GitHub Actions",
      "  - Docker",
      "  - Kubernetes",
      "  - Terraform",
      "tunneling: [SSH, VPN]",
      "> applying configuration...",
      "> environment ready ✓",
      "> stack loaded ✓",
    ],
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
    filename: "dev-stack.ts",
    codeLines: [
      "// dev-stack.ts",
      "import { Django, Flask, FastAPI } from 'python'",
      "import { SpringBoot } from 'java'",
      "import { React, TypeScript } from 'frontend'",
      "> building modules...",
      "> all systems go ✓",
      "> stack loaded ✓",
    ],
    tools: [
      { name: "Python", tag: "Django · Flask · FastAPI", abbr: "Py", tone: "green" },
      { name: "TypeScript", tag: "type-safe JS", abbr: "Ts", tone: "blue" },
      { name: "Java Spring Boot", tag: "enterprise apps", abbr: "Jv", tone: "green" },
      { name: "React", tag: "frontend SPA", abbr: "Rx", tone: "blue" },
      { name: "REST API", tag: "integrations", abbr: "Ap", tone: "mix" },
    ],
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="tool-card group relative grad-border glass rounded-xl p-5 flex items-center gap-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        willChange: "transform",
      }}
    >
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

function lineColor(line: string): string {
  if (line.startsWith(">")) {
    return line.includes("✓") ? "#00FF41" : "#a0aec0";
  }
  if (line.startsWith("//") || line.startsWith("#")) return "#6b7280";
  return "#e2e8f0";
}

function SkillGroup({ group }: { group: Group }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ideRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);
  void done;

  // Cursor blink
  useEffect(() => {
    const id = window.setInterval(() => setShowCursor((s) => !s), 400);
    return () => window.clearInterval(id);
  }, []);

  // Trigger sequence on scroll enter
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    let cancelled = false;

    // Hide cards initially
    const initialCards = cardsRef.current?.querySelectorAll<HTMLElement>(".tool-card") ?? [];
    gsap.set(initialCards, { opacity: 0, scale: 0.6 });

    const startSequence = async () => {
      // 1. Type each line
      for (let li = 0; li < group.codeLines.length; li++) {
        if (cancelled) return;
        const line = group.codeLines[li];
        for (let ci = 0; ci <= line.length; ci++) {
          if (cancelled) return;
          setCurrentLine(line.slice(0, ci));
          await new Promise((r) => setTimeout(r, 28));
        }
        setTypedLines((prev) => [...prev, line]);
        setCurrentLine("");
        await new Promise((r) => setTimeout(r, 80));
      }
      // 2. IDE slides up + cards burst in
      if (cancelled) return;
      gsap.to(ideRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
      const cardEls = cardsRef.current?.querySelectorAll<HTMLElement>(".tool-card") ?? [];
      gsap.fromTo(
        cardEls,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.4)",
          delay: 0.3,
        },
      );
      setDone(true);
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      once: true,
      onEnter: () => {
        startSequence();
      },
    });

    return () => {
      cancelled = true;
      st.kill();
    };
  }, [group]);

  return (
    <div ref={rootRef} className="mb-20 last:mb-0">
      <div className="mb-6 flex items-baseline gap-4">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          {group.subtitle}
        </div>
      </div>
      <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight mb-7">
        {group.title}
      </h3>

      {/* IDE compile panel */}
      <div className="relative" style={{ minHeight: done ? 0 : "auto" }}>
        {!done && (
          <div
            ref={ideRef}
            className="rounded-xl overflow-hidden mb-6 backdrop-blur-md"
            style={{
              border: "1px solid rgba(26, 110, 255, 0.3)",
              background: "rgba(10, 10, 10, 0.95)",
              willChange: "transform, opacity",
            }}
          >
            {/* header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="font-mono text-[11px] text-muted ml-2 px-2 py-0.5 rounded bg-white/5">
                {group.filename}
              </div>
            </div>
            {/* code body */}
            <pre
              className="px-5 py-4 font-mono text-[13px] leading-relaxed overflow-x-auto"
              style={{ minHeight: "220px" }}
            >
              {typedLines.map((line, i) => (
                <div key={i} style={{ color: lineColor(line) }}>
                  {line || "\u00A0"}
                </div>
              ))}
              <div style={{ color: lineColor(currentLine) }}>
                {currentLine}
                <span style={{ opacity: showCursor ? 1 : 0, color: "#1A6EFF" }}>
                  |
                </span>
              </div>
            </pre>
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
      >
        {group.tools.map((t) => (
          <ToolCard key={t.name} tool={t} />
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

        {GROUPS.map((g) => (
          <SkillGroup key={g.title} group={g} />
        ))}
      </div>
    </section>
  );
}
