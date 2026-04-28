import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/components/contact/ContactModalContext";

gsap.registerPlugin(ScrollTrigger);

const HEADLINES = [
  "Infraestrutura sólida. Código que entrega.",
  "NOC Analyst. DevOps Engineer. Developer.",
  "Do monitoramento à produção — cuido do caminho.",
  "Automação, sistemas e software. Do início ao fim.",
];

function RotatingHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % HEADLINES.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{
        overflow: "hidden",
        minHeight: "clamp(3.6rem, 12vw, 9rem)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={idx}
          initial={{ x: "110%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-110%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
          className="font-display font-bold tracking-tight text-white"
          style={{
            fontSize: "clamp(1.8rem, 5.5vw, 6.5rem)",
            lineHeight: 1.05,
            whiteSpace: "normal",
            wordBreak: "break-word",
            willChange: "transform, opacity",
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

  // Load timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        lineRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.9, ease: "power3.inOut" },
      )
        .fromTo(
          labelRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          headlineRef.current?.querySelectorAll("[data-w]") ?? [],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.2",
        )
        .fromTo(
          subRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          ctasRef.current?.children ?? [],
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15 },
          "-=0.3",
        )
        .fromTo(indicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Scroll parallax (5 layers)
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

  const subtitle = "Profissional de TI com atuação em NOC, DevOps e desenvolvimento de software. São Paulo, Brasil.";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <div ref={gridRef} className="absolute inset-0 grid-dots" style={{ willChange: "transform" }} />

      {/* Atmospheric glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #1A6EFF 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #00B4D8 0%, transparent 70%)" }}
      />

      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div ref={lineRef} className="h-full grad-bg" style={{ width: "0%" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 pt-36 md:pt-44 pb-24">
        <div
          ref={labelRef}
          className="font-mono text-xs md:text-sm text-muted tracking-[0.25em] uppercase mb-7 flex items-center gap-3"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="inline-block h-px w-8 grad-bg" />
          guilherme.aires — NOC / DEVOPS / DEV
        </div>

        <div
          ref={headlineRef}
          className="mb-10 w-full"
          style={{
            willChange: "transform",
            overflow: "visible",
          }}
        >
          {/* per-word wrapper for initial stagger; rotating headline uses framer-motion */}
          <span data-w className="inline-block w-full">
            <RotatingHeadline />
          </span>
        </div>

        <p
          ref={subRef}
          className="max-w-2xl text-base md:text-lg text-muted leading-relaxed mb-10"
          style={{ willChange: "transform" }}
        >
          {subtitle}
        </p>

        <div ref={ctasRef} className="flex flex-wrap gap-4" style={{ willChange: "transform" }}>
          <motion.a
            whileHover={{ y: -2, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.97 }}
            href="#projects"
            className="inline-flex items-center gap-2 text-black font-medium px-6 py-3.5 rounded-md font-display tracking-tight"
            style={{
              background: "linear-gradient(90deg, #1A6EFF 0%, #00B4D8 100%)",
              boxShadow: "0 8px 32px rgba(26,110,255,0.35)",
            }}
          >
            Ver Projetos
            <span aria-hidden>→</span>
          </motion.a>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="grad-border rounded-md inline-flex items-center gap-2 px-6 py-3.5 text-white font-display tracking-tight"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            Entre em Contato
          </motion.button>
        </div>

        <div className="mt-16 flex items-center gap-3 text-xs font-mono text-muted">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          status: online · São Paulo, BR
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px relative overflow-hidden"
        >
          <div className="absolute top-0 h-4 w-full grad-bg" />
        </motion.div>
      </div>
    </section>
  );
}
