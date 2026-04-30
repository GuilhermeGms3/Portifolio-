import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  "Seu negócio depende demais de planilhas.",
  "Seu atendimento perde leads no WhatsApp.",
  "Seu site atual parece antigo ou amador.",
  "Você precisa apresentar melhor seus serviços.",
  "Você não tem um painel claro de dados.",
  "Você precisa colocar uma ideia no ar com rapidez.",
  "Você quer automatizar tarefas repetitivas.",
];

export function ProblemsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: itemsRef.current,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 2,
          },
        },
      );

      const items = itemsRef.current?.querySelectorAll(".prob-row") ?? [];
      items.forEach((row) => {
        gsap.fromTo(
          row,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problems"
      className="relative py-28 md:py-40 px-6 md:px-12"
      style={{ background: "#101012" }}
    >
      <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <div ref={headerRef} className="mb-16 md:mb-20 max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ink-3" />
            diagnóstico
          </div>
          <h2
            className="font-display font-semibold tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            <span className="text-ink">Problemas que </span>
            <span className="grad-text">eu resolvo.</span>
          </h2>
        </div>

        <div ref={itemsRef} className="relative pl-8 md:pl-12">
          {/* Vertical line drawn on scroll */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-px origin-top"
            style={{
              background: "linear-gradient(180deg, #FAFAFA, #71717A, transparent)",
              transform: "scaleY(0)",
            }}
          />

          {PROBLEMS.map((p, i) => (
            <div
              key={p}
              className="prob-row relative flex items-start gap-6 md:gap-8 py-6 md:py-7 border-b border-white/5 last:border-b-0"
              style={{ willChange: "transform, opacity" }}
            >
              <div
                className="absolute -left-[37px] md:-left-[49px] top-8 md:top-9 h-2 w-2 rounded-full"
                style={{ background: "#FAFAFA", boxShadow: "0 0 12px rgba(255,255,255,0.5)" }}
              />
              <div className="font-mono text-[11px] tracking-[0.25em] text-ink-3 pt-1.5 min-w-[2.5rem]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 font-display text-xl md:text-2xl lg:text-[1.65rem] text-ink leading-snug tracking-tight">
                {p}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
