import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Skill = { label: string; value: number };
type Group = { title: string; items: Skill[] };

const GROUPS: Group[] = [
  {
    title: "INFRASTRUCTURE & NOC",
    items: [
      { label: "Monitoramento de Redes", value: 90 },
      { label: "Gestão de Incidentes", value: 85 },
      { label: "Infraestrutura Linux", value: 80 },
      { label: "Firewall & Segurança (IPTables/UFW)", value: 75 },
    ],
  },
  {
    title: "DEVOPS & AUTOMATION",
    items: [
      { label: "Shell Script / Bash", value: 75 },
      { label: "Docker & Containers", value: 70 },
      { label: "CI/CD Pipelines", value: 65 },
      { label: "Git & GitHub Actions", value: 60 },
    ],
  },
  {
    title: "DEVELOPMENT",
    items: [
      { label: "Python", value: 75 },
      { label: "JavaScript", value: 65 },
      { label: "Java", value: 60 },
      { label: "React", value: 55 },
    ],
  },
];

function ProgressBar({ skill, delay }: { skill: Skill; delay: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { width: "0%" },
        {
          width: `${skill.value}%`,
          duration: 1.2,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
      const counter = { v: 0 };
      gsap.to(counter, {
        v: skill.value,
        duration: 1.2,
        delay,
        ease: "power2.out",
        onUpdate: () => setPct(Math.round(counter.v)),
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, [skill.value, delay]);

  // pre-rendered ascii blocks (20 blocks for visual)
  const total = 20;
  const filled = Math.round((pct / 100) * total);
  const blocks = "█".repeat(filled) + "░".repeat(total - filled);

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-4 mb-1.5">
        <span className="font-mono text-sm md:text-base text-foreground/85 truncate">
          {skill.label}
        </span>
        <span className="font-terminal text-sm text-terminal glow-text shrink-0">
          {pct.toString().padStart(2, "0")}%
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3 font-terminal text-terminal/85 text-sm leading-none">
        <span ref={blocksRef} className="tracking-tighter">[{blocks}]</span>
      </div>
      <div className="md:hidden relative h-2 w-full bg-terminal/10 border border-terminal/30 overflow-hidden">
        <div ref={fillRef} className="absolute inset-y-0 left-0 bg-gradient-to-r from-terminal-dim via-terminal to-terminal glow-box-sm" />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 md:py-32 px-6 md:px-12 border-b border-terminal/15">
      <div className="mx-auto max-w-6xl">
        <div className="font-terminal text-sm text-terminal/70 mb-3">
          guilherme@portfolio:~$
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-terminal-bright glow-text-strong mb-12">
          &gt; skills --list
        </h2>

        <div className="space-y-12">
          {GROUPS.map((group, gi) => (
            <div key={group.title}>
              <div className="font-terminal text-terminal text-sm md:text-base mb-5 flex items-center gap-3">
                <span className="text-terminal/50">[{String(gi + 1).padStart(2, "0")}]</span>
                <span className="glow-text">{group.title}</span>
                <span className="flex-1 h-px bg-terminal/20" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {group.items.map((s, i) => (
                  <ProgressBar key={s.label} skill={s} delay={i * 0.1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
