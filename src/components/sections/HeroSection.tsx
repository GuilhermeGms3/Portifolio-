import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/components/contact/ContactModalContext";

gsap.registerPlugin(ScrollTrigger);

const HEADLINES = [
  "Sites, sistemas e automações para negócios que querem sair do improviso.",
  "Presença digital com estética, estratégia e estrutura.",
  "Landing pages, sistemas internos e automações sob medida.",
  "Do layout ao deploy: eu construo a solução completa.",
  "Tecnologia para negócios que precisam parecer maiores.",
];

function RotatingHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % HEADLINES.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{
        overflow: "hidden",
        minHeight: "clamp(7rem, 22vw, 18rem)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={idx}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1] }}
          className="font-display font-semibold tracking-tight text-ink"
          style={{
            fontSize: "clamp(1.7rem, 4.6vw, 5rem)",
            lineHeight: 1.08,
            whiteSpace: "normal",
            wordBreak: "break-word",
            willChange: "transform, opacity",
            background: "linear-gradient(180deg, #FAFAFA 0%, #A1A1AA 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {HEADLINES[idx]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { openModal } = useContactModal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(lineRef.current, { width: "0%" }, { width: "100%", duration: 1.0, ease: "power3.inOut" })
        .fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(headlineRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.2")
        .fromTo(subRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .fromTo(ctasRef.current?.children ?? [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, "-=0.4")
        .fromTo(indicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 12,
      };
      gsap.to(gridRef.current, { y: () => window.innerHeight * 0.08, ease: "none", scrollTrigger: trig });
      gsap.to(labelRef.current, { y: () => window.innerHeight * 0.35, ease: "none", scrollTrigger: trig });
      gsap.to(headlineRef.current, { y: () => window.innerHeight * 0.45, ease: "none", scrollTrigger: trig });
      gsap.to(subRef.current, { y: () => window.innerHeight * 0.58, ease: "none", scrollTrigger: trig });
      gsap.to(ctasRef.current, { y: () => window.innerHeight * 0.68, ease: "none", scrollTrigger: trig });
      gsap.to(indicatorRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...trig, end: "10% top" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const subtitle =
    "Desenvolvo landing pages, sites institucionais, sistemas internos, dashboards e automações para empresas, profissionais autônomos e projetos digitais.";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden vignette"
      style={{ background: "#050505" }}
    >
      <div ref={gridRef} className="absolute inset-0 grid-dots" style={{ willChange: "transform" }} />

      {/* Premium dark atmospheric glows — subtle, neutral */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, rgba(91,33,182,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[640px] w-[640px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
      />

      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div ref={lineRef} className="h-full" style={{ width: "0%", background: "linear-gradient(90deg, transparent, #FAFAFA, transparent)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 pt-36 md:pt-44 pb-24">
        <div
          ref={labelRef}
          className="font-mono text-xs md:text-sm text-ink-3 tracking-[0.30em] uppercase mb-7 flex items-center gap-3"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="inline-block h-px w-8 bg-ink-3" />
          estúdio digital · guilherme aires
        </div>

        <div
          ref={headlineRef}
          className="mb-10 w-full"
          style={{ willChange: "transform", overflow: "visible" }}
        >
          <RotatingHeadline />
        </div>

        <p
          ref={subRef}
          className="max-w-2xl text-base md:text-lg text-ink-2 leading-relaxed mb-10"
          style={{ willChange: "transform" }}
        >
          {subtitle}
        </p>

        <div ref={ctasRef} className="flex flex-wrap gap-4" style={{ willChange: "transform" }}>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-display font-medium tracking-tight text-black"
            style={{
              background: "linear-gradient(180deg, #FAFAFA 0%, #D4D4D8 100%)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            Solicitar orçamento
            <span aria-hidden>→</span>
          </motion.button>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#services"
            className="grad-border rounded-md inline-flex items-center gap-2 px-6 py-3.5 text-ink font-display tracking-tight"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            Ver serviços
          </motion.a>
        </div>

        <div className="mt-16 flex items-center gap-3 text-xs font-mono text-ink-3">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-50 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/80" />
          </span>
          disponível para freelas · São Paulo, BR
        </div>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-ink-3 uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px relative overflow-hidden"
        >
          <div className="absolute top-0 h-4 w-full" style={{ background: "linear-gradient(180deg, #FAFAFA, transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}
