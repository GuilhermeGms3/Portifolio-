import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Skill = { label: string; value: number };
type Group = { title: string; subtitle: string; tone: "blue" | "green"; items: Skill[] };

const GROUPS: Group[] = [
  {
    title: "Infrastructure & NOC",
    subtitle: "monitoramento · incidentes",
    tone: "blue",
    items: [
      { label: "Monitoramento de Redes", value: 90 },
      { label: "Gestão de Incidentes", value: 85 },
      { label: "Linux Administration", value: 80 },
      { label: "Firewall IPTables/UFW", value: 75 },
    ],
  },
  {
    title: "DevOps & Automation",
    subtitle: "pipelines · containers",
    tone: "blue",
    items: [
      { label: "Shell Script / Bash", value: 80 },
      { label: "Docker & Containers", value: 70 },
      { label: "CI/CD Pipelines", value: 65 },
      { label: "Git & GitHub Actions", value: 70 },
    ],
  },
  {
    title: "Development",
    subtitle: "código · aplicações",
    tone: "green",
    items: [
      { label: "Python", value: 75 },
      { label: "JavaScript", value: 65 },
      { label: "Java", value: 60 },
      { label: "React", value: 60 },
    ],
  },
];

function SkillCard({ group, rowIndex }: { group: Group; rowIndex: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [pcts, setPcts] = useState<number[]>(() => group.items.map(() => 0));

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      // card enter
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: rowIndex * 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
        },
      );
      // bars
      const bars = barsRef.current?.querySelectorAll<HTMLDivElement>(".skill-bar-fill") ?? [];
      bars.forEach((bar, i) => {
        const target = group.items[i].value;
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.2,
            ease: "power2.out",
            delay: rowIndex * 0.15 + 0.3 + i * 0.08,
            scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
          },
        );
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.2,
          delay: rowIndex * 0.15 + 0.3 + i * 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
          onUpdate: () =>
            setPcts((prev) => {
              const next = [...prev];
              next[i] = Math.round(counter.v);
              return next;
            }),
        });
      });
    }, cardRef);
    return () => ctx.revert();
  }, [group, rowIndex]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grad-border glass rounded-xl p-6 md:p-7 relative overflow-hidden"
      style={{ willChange: "transform" }}
    >
      {/* accent glow */}
      <div
        className={`absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-30 ${
          group.tone === "blue" ? "bg-blue" : "bg-green"
        }`}
        style={{
          background:
            group.tone === "blue"
              ? "radial-gradient(circle, #1A6EFF 0%, transparent 70%)"
              : "radial-gradient(circle, #00FF41 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
          {group.subtitle}
        </div>
        <h3 className="font-display font-semibold text-xl md:text-2xl text-white mb-6 tracking-tight">
          {group.title}
        </h3>

        <div ref={barsRef} className="space-y-4">
          {group.items.map((s, i) => (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="font-body text-sm text-white/85 truncate">{s.label}</span>
                <span className="font-mono text-xs grad-text font-semibold tabular-nums">
                  {String(pcts[i]).padStart(2, "0")}%
                </span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="skill-bar-fill absolute inset-y-0 left-0 rounded-full grad-bg"
                  style={{ width: "0%", willChange: "width" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {GROUPS.map((g, i) => (
            <SkillCard key={g.title} group={g} rowIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
