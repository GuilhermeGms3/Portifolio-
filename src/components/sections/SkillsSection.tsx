import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Category = {
  title: string;
  subtitle: string;
  tools: string[];
};

const CATEGORIES: Category[] = [
  {
    title: "NOC & Monitoramento",
    subtitle: "observabilidade · análise",
    tools: ["Grafana", "Zabbix", "Prometheus", "Nginx", "Pentest"],
  },
  {
    title: "DevOps & Infraestrutura",
    subtitle: "pipelines · containers · cloud",
    tools: ["GitHub Actions", "Docker", "Kubernetes", "Terraform", "SSH Tunneling", "Git"],
  },
  {
    title: "Desenvolvimento",
    subtitle: "código · aplicações · APIs",
    tools: [
      "Python (Django · Flask · FastAPI)",
      "TypeScript",
      "Java Spring Boot",
      "React",
      "REST APIs",
    ],
  },
];

function CategoryBlock({ category }: { category: Category }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
      });
      tl.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
      const pills = pillsRef.current?.querySelectorAll(".tool-pill") ?? [];
      tl.fromTo(
        pills,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" },
        "-=0.25",
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mb-14 last:mb-0">
      <div ref={headerRef}>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-2 flex items-center gap-3">
          <span className="inline-block h-px w-6 grad-bg" />
          {category.subtitle}
        </div>
        <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight mb-6">
          {category.title}
        </h3>
      </div>

      <div ref={pillsRef} className="flex flex-wrap gap-2.5">
        {category.tools.map((t) => (
          <motion.span
            key={t}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.18 }}
            className="tool-pill grad-border-hover relative font-mono text-[12px] text-white px-4 py-2 rounded-full"
            style={{
              background: "rgba(26, 110, 255, 0.08)",
              border: "1px solid rgba(26, 110, 255, 0.3)",
              willChange: "transform",
            }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative py-28 md:py-40 px-6 md:px-12 grid-dots"
      style={{ background: "#0a0a0a" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          expertise
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-14 max-w-3xl">
          Stack &amp; <span className="grad-text">Ferramentas</span>
        </h2>

        {CATEGORIES.map((c) => (
          <CategoryBlock key={c.title} category={c} />
        ))}
      </div>
    </section>
  );
}
