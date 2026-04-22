import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Entry = {
  period: string;
  role: string;
  description: string;
};

const ENTRIES: Entry[] = [
  {
    period: "2024 — present",
    role: "Analista NOC",
    description:
      "Monitoramento de infraestrutura, gestão de incidentes, suporte técnico N2/N3 e resposta a alertas críticos.",
  },
  {
    period: "2023 — 2024",
    role: "DevOps & Automação",
    description:
      "Automação de processos com Shell Script, implementação e gestão de firewalls, containers Docker e pipelines CI/CD.",
  },
  {
    period: "ongoing",
    role: "Desenvolvimento de Software",
    description:
      "Projetos pessoais e freelance em Python, JavaScript e Java. Automação, integrações e aplicações web.",
  },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;
    const ctx = gsap.context(() => {
      // line draws as user scrolls
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 1.2,
          },
        },
      );

      // nodes pop in
      gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.55)",
            scrollTrigger: { trigger: node, start: "top 80%" },
          },
        );
      });

      // cards slide from sides
      gsap.utils.toArray<HTMLElement>(".tl-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 80%" },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-24 md:py-32 px-6 md:px-12"
      style={{ background: "var(--surface-2)" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          experiência profissional
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-16">
          <span className="grad-text">Trajetória</span>
        </h2>

        <div className="relative">
          {/* central baseline (faint) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          {/* gradient line that draws */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{
              backgroundImage: "linear-gradient(180deg, #1A6EFF 0%, #00FF41 100%)",
              transformOrigin: "top center",
              willChange: "transform",
            }}
          />

          <div className="space-y-16">
            {ENTRIES.map((e, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={e.role}
                  className="relative grid md:grid-cols-2 md:gap-12 items-center"
                >
                  {/* node on line */}
                  <div className="tl-node absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                    <div
                      className="h-4 w-4 rounded-full grad-bg"
                      style={{ boxShadow: "0 0 18px rgb(26 110 255 / 0.7)" }}
                    />
                  </div>

                  {/* card */}
                  <div
                    className={`tl-card grad-border glass rounded-xl p-6 md:p-7 ml-12 md:ml-0 ${
                      isLeft ? "md:col-start-1 md:mr-10 md:text-right" : "md:col-start-2 md:ml-10"
                    }`}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="font-mono text-xs grad-text mb-2 tracking-wide">
                      {e.period}
                    </div>
                    <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight mb-3">
                      {e.role}
                    </h3>
                    <p className="text-muted leading-relaxed">{e.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
