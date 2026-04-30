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
    title: "Frontend",
    subtitle: "interface · experiência",
    tools: ["React", "Next.js", "TailwindCSS", "TypeScript"],
  },
  {
    title: "Backend",
    subtitle: "lógica · aplicações · APIs",
    tools: ["Node.js", "Python", "Java Spring Boot", "REST APIs"],
  },
  {
    title: "Dados & Automação",
    subtitle: "integração · pipelines",
    tools: ["PostgreSQL", "Pandas", "Power BI", "APIs", "Webhooks"],
  },
  {
    title: "Infraestrutura",
    subtitle: "deploy · publicação",
    tools: ["Docker", "Nginx", "Cloudflare Tunnel", "Linux", "GitHub Actions"],
  },
  {
    title: "Monitoramento",
    subtitle: "observabilidade · estabilidade",
    tools: ["Grafana", "Zabbix", "Prometheus"],
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
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
      const pills = pillsRef.current?.querySelectorAll(".tool-pill") ?? [];
      tl.fromTo(
        pills,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        "-=0.4",
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mb-14 last:mb-0">
      <div ref={headerRef}>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-2 flex items-center gap-3">
          <span className="inline-block h-px w-6 bg-ink-3" />
          {category.subtitle}
        </div>
        <h3 className="font-display font-semibold text-2xl md:text-3xl text-ink tracking-tight mb-6">
          {category.title}
        </h3>
      </div>

      <div ref={pillsRef} className="flex flex-wrap gap-2.5">
        {category.tools.map((t) => (
          <motion.span
            key={t}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="tool-pill font-mono text-[12px] text-ink px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
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
      className="relative py-28 md:py-40 px-6 md:px-12"
      style={{ background: "#141416" }}
    >
      <div className="absolute inset-0 grid-dots opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-ink-3" />
          stack & bastidores
        </div>
        <h2
          className="font-display font-semibold tracking-tight max-w-3xl mb-6"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
        >
          <span className="text-ink">A engenharia por trás </span>
          <span className="grad-text">da entrega.</span>
        </h2>
        <p className="max-w-2xl text-ink-2 leading-relaxed mb-14 md:mb-20">
          A stack não aparece para o cliente final, mas é ela que sustenta uma
          entrega estável, escalável e bem publicada.
        </p>

        {CATEGORIES.map((c) => (
          <CategoryBlock key={c.title} category={c} />
        ))}
      </div>
    </section>
  );
}
