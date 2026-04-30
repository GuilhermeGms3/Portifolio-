import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Diagnóstico",
    body: "Entendo o negócio, o problema, o público e o objetivo da solução.",
  },
  {
    num: "02",
    title: "Estrutura",
    body: "Defino páginas, fluxos, funcionalidades, integrações e prioridades.",
  },
  {
    num: "03",
    title: "Protótipo",
    body: "Crio uma direção visual e uma experiência clara antes do desenvolvimento final.",
  },
  {
    num: "04",
    title: "Desenvolvimento",
    body: "Construo a interface, lógica, integrações, backend ou automações necessárias.",
  },
  {
    num: "05",
    title: "Deploy",
    body: "Coloco o projeto no ar com domínio, hospedagem, configuração e testes.",
  },
  {
    num: "06",
    title: "Ajustes",
    body: "Faço refinamentos finais para deixar a entrega mais profissional e funcional.",
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

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

      // Vertical line draws as user scrolls through steps
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 2,
          },
        },
      );

      stepRefs.current.forEach((step) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 82%", once: true },
          },
        );

        // Subtle "light up" effect on the step's dot when in view
        const dot = step.querySelector(".step-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { backgroundColor: "rgba(113,113,122,0.5)", boxShadow: "0 0 0 rgba(255,255,255,0)" },
            {
              backgroundColor: "rgba(250,250,250,1)",
              boxShadow: "0 0 18px rgba(255,255,255,0.55)",
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: step, start: "top 70%", once: true },
            },
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-28 md:py-40 px-6 md:px-12"
      style={{ background: "#101012" }}
    >
      <div className="absolute inset-0 grid-dots opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <div ref={headerRef} className="mb-16 md:mb-24 max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ink-3" />
            processo
          </div>
          <h2
            className="font-display font-semibold tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            <span className="text-ink">Como funciona o </span>
            <span className="grad-text">processo.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink-2 leading-relaxed">
            Um fluxo claro do diagnóstico ao deploy — sem improviso, com método
            e foco na entrega.
          </p>
        </div>

        <div ref={stepsContainerRef} className="relative pl-10 md:pl-16">
          {/* Static line track */}
          <div
            className="absolute left-2 md:left-4 top-2 bottom-2 w-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          {/* Drawn line */}
          <div
            ref={lineRef}
            className="absolute left-2 md:left-4 top-2 bottom-2 w-px origin-top"
            style={{
              background: "linear-gradient(180deg, #FAFAFA 0%, #71717A 70%, transparent 100%)",
              transform: "scaleY(0)",
            }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="relative pb-14 md:pb-20 last:pb-0"
              style={{ willChange: "transform, opacity" }}
            >
              {/* dot */}
              <span
                className="step-dot absolute -left-[35px] md:-left-[51px] top-2 h-3 w-3 rounded-full"
                style={{ background: "rgba(113,113,122,0.5)" }}
              />

              <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 mb-4">
                <div
                  className="font-display font-bold text-ink-3 tracking-tight leading-none"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    background: "linear-gradient(180deg, #52525B 0%, #18181B 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-display font-semibold text-2xl md:text-3xl lg:text-4xl text-ink tracking-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-ink-2 leading-relaxed text-base md:text-lg max-w-2xl">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
