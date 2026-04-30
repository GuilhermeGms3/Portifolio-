import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  num: string;
  title: string;
  desc: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Landing Pages",
    desc: "Páginas focadas em apresentação, conversão e captação de leads.",
  },
  {
    num: "02",
    title: "Sites Institucionais",
    desc: "Sites profissionais para empresas, marcas pessoais e negócios locais.",
  },
  {
    num: "03",
    title: "Sistemas Internos",
    desc: "Painéis, cadastros, dashboards e ferramentas para organizar processos.",
  },
  {
    num: "04",
    title: "Automações",
    desc: "Integrações com APIs, formulários, WhatsApp, planilhas e fluxos automatizados.",
  },
  {
    num: "05",
    title: "Infraestrutura & Deploy",
    desc: "Publicação, domínio, hospedagem, containers, proxy, monitoramento e manutenção.",
  },
  {
    num: "06",
    title: "Dashboards",
    desc: "Visualização de dados e indicadores para decisões mais claras.",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      const cards = gridRef.current?.querySelectorAll(".srv-card") ?? [];
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-28 md:py-40 px-6 md:px-12 vignette"
      style={{ background: "#0A0A0B" }}
    >
      <div className="absolute inset-0 grid-dots opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-16 md:mb-20">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-3 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ink-3" />
            serviços
          </div>
          <h2
            className="font-display font-semibold tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            <span className="grad-text">Soluções digitais</span>
            <span className="text-ink"> sob medida.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink-2 leading-relaxed">
            Da concepção ao deploy — desenvolvo presença digital, sistemas e
            automações para negócios que precisam de uma entrega séria.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((s) => (
            <motion.div
              key={s.num}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="srv-card card-premium card-premium-hover relative rounded-xl p-7 md:p-8 overflow-hidden group"
              style={{ willChange: "transform, opacity" }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-ink-3">
                    serviço · {s.num}
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-3 mt-2 group-hover:bg-ink transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] text-ink tracking-tight mb-4">
                  {s.title}
                </h3>
                <p className="text-ink-2 leading-relaxed text-[15px]">{s.desc}</p>

                <div className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink-3 group-hover:text-ink transition-colors">
                  <span>saiba mais</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
