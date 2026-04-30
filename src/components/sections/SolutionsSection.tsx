import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Solution = {
  tag: string;
  title: string;
};

const SOLUTIONS: Solution[] = [
  { tag: "site institucional", title: "Landing page para empresa de engenharia" },
  { tag: "site institucional", title: "Site para clínica ou consultório" },
  { tag: "sistema interno", title: "Sistema de agendamento" },
  { tag: "dashboard", title: "Dashboard financeiro administrativo" },
  { tag: "automação", title: "Automação de atendimento via WhatsApp" },
  { tag: "sistema interno", title: "Sistema interno para cadastro e gestão" },
  { tag: "landing page", title: "Página de vendas para serviço ou produto digital" },
  { tag: "automação", title: "Integração entre formulário, planilha e CRM" },
];

export function SolutionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        },
      );

      const cards = gridRef.current?.querySelectorAll(".sol-card") ?? [];
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
        },
      );

      gsap.fromTo(
        footerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 85%", once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative py-28 md:py-40 px-6 md:px-12"
      style={{ background: "#0A0A0B" }}
    >
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-16 md:mb-20 max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ink-3" />
            soluções
          </div>
          <h2
            className="font-display font-semibold tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            <span className="text-ink">Soluções que </span>
            <span className="grad-text">posso construir.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink-2 leading-relaxed">
            Exemplos de entregas que posso desenvolver — adaptáveis ao seu
            negócio, escala e estágio do projeto.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="sol-card card-premium card-premium-hover relative rounded-xl p-6 md:p-7 group overflow-hidden"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3">
                    {s.tag}
                  </div>
                  <h3 className="font-display font-medium text-xl md:text-[1.4rem] text-ink tracking-tight leading-snug">
                    {s.title}
                  </h3>
                </div>
                <div className="font-mono text-[11px] text-ink-3 mt-1 tabular-nums">
                  /{String(i + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          ref={footerRef}
          className="mt-16 md:mt-20 max-w-2xl mx-auto text-center"
        >
          <p className="font-display text-xl md:text-2xl text-ink-2 italic leading-snug tracking-tight">
            "Mesmo quando o projeto começa pequeno, a entrega pode nascer
            preparada para crescer."
          </p>
        </div>
      </div>
    </section>
  );
}
