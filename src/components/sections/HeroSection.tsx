import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const HEADLINES = [
  "Infraestrutura sólida. Código que entrega.",
  "NOC Analyst. DevOps Engineer. Developer.",
  "Do monitoramento à produção — eu cuido do caminho.",
  "Automação, sistemas e software. Do início ao fim.",
];

/**
 * Headline rendered as SVG <text> that draws itself stroke-by-stroke
 * (gradient stroke), then fills with white. Exits by erasing.
 */
function DrawingHeadline() {
  const [idx, setIdx] = useState(0);
  const textRef = useRef<SVGTextElement>(null);
  const wrapRef = useRef<SVGSVGElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [supportsStroke, setSupportsStroke] = useState(true);

  // Draw + fill + hold + erase, then advance idx
  useEffect(() => {
    const node = textRef.current;
    if (!node) {
      // fallback: simple fade after delay
      const id = window.setTimeout(
        () => setIdx((i) => (i + 1) % HEADLINES.length),
        3500,
      );
      return () => window.clearTimeout(id);
    }

    let len = 0;
    try {
      len = (node as unknown as SVGGeometryElement).getComputedTextLength
        ? node.getComputedTextLength() * 2.2 // approx stroke length
        : 1200;
    } catch {
      setSupportsStroke(false);
      const id = window.setTimeout(
        () => setIdx((i) => (i + 1) % HEADLINES.length),
        3500,
      );
      return () => window.clearTimeout(id);
    }
    if (!len || !isFinite(len)) {
      setSupportsStroke(false);
      const id = window.setTimeout(
        () => setIdx((i) => (i + 1) % HEADLINES.length),
        3500,
      );
      return () => window.clearTimeout(id);
    }

    node.style.strokeDasharray = String(len);
    node.style.strokeDashoffset = String(len);
    node.style.fillOpacity = "0";
    node.style.strokeOpacity = "1";

    const tl = gsap.timeline({
      onComplete: () => setIdx((i) => (i + 1) % HEADLINES.length),
    });
    // 1. draw stroke
    tl.to(node, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: "power2.inOut",
    });
    // 2. fill in white, fade stroke out
    tl.to(
      node,
      { fillOpacity: 1, duration: 0.6, ease: "power2.out" },
      ">-0.05",
    );
    tl.to(
      node,
      { strokeOpacity: 0, duration: 0.6, ease: "power2.out" },
      "<",
    );
    // 3. hold visible
    tl.to({}, { duration: 2.5 });
    // 4. erase: stroke comes back, fill fades out
    tl.to(node, { strokeOpacity: 1, duration: 0.2 }, ">");
    tl.to(
      node,
      { fillOpacity: 0, duration: 1.0, ease: "power2.in" },
      "<",
    );
    tl.to(
      node,
      { strokeDashoffset: len, duration: 1.2, ease: "power2.in" },
      "<",
    );

    return () => {
      tl.kill();
    };
  }, [idx]);

  // Fallback DOM reveal (char-by-char) if SVG stroke unsupported
  useEffect(() => {
    if (supportsStroke) return;
    const el = fallbackRef.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-c]");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" },
    );
  }, [idx, supportsStroke]);

  if (!supportsStroke) {
    return (
      <div
        ref={fallbackRef}
        className="font-display font-semibold tracking-tight text-white"
        style={{ fontSize: "clamp(1.6rem, 4vw, 4rem)", lineHeight: 1.15 }}
      >
        {HEADLINES[idx].split("").map((c, i) => (
          <span key={i} data-c className="inline-block">
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </div>
    );
  }

  return (
    <svg
      ref={wrapRef}
      viewBox="0 0 1200 130"
      preserveAspectRatio="xMinYMid meet"
      className="w-full block"
      style={{ height: "clamp(3.2rem, 8vw, 9rem)", overflow: "visible" }}
      aria-label={HEADLINES[idx]}
    >
      <defs>
        <linearGradient id="headline-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00FF41" />
        </linearGradient>
      </defs>
      <text
        ref={textRef}
        key={idx}
        x="0"
        y="86"
        fontFamily="Space Grotesk, system-ui, sans-serif"
        fontWeight={700}
        fontSize="74"
        letterSpacing="-2"
        fill="#ffffff"
        stroke="url(#headline-stroke)"
        strokeWidth={1.4}
        style={{
          willChange: "stroke-dashoffset, fill-opacity",
          fillOpacity: 0,
        }}
      >
        {HEADLINES[idx]}
      </text>
    </svg>
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

  // Load timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
        .fromTo(
          lineRef.current,
          { width: "0%" },
          { width: "100%", duration: 0.8, ease: "power3.inOut" },
          "-=0.6",
        )
        .fromTo(
          labelRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.2",
        )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          ctasRef.current?.children ?? [],
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15 },
          "-=0.3",
        )
        .fromTo(
          indicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2",
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Scroll parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trig = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 8,
      };
      gsap.to(gridRef.current, { y: 80, ease: "none", scrollTrigger: trig });
      gsap.to(headlineRef.current, { y: 320, ease: "none", scrollTrigger: trig });
      gsap.to(subRef.current, { y: 440, ease: "none", scrollTrigger: trig });
      gsap.to(ctasRef.current, { y: 520, ease: "none", scrollTrigger: trig });
      gsap.to(indicatorRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...trig, end: "10% top" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid-dots opacity-0"
        style={{ willChange: "transform, opacity" }}
      />
      {/* Atmospheric glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #1A6EFF 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #00FF41 0%, transparent 70%)" }}
      />

      {/* Top thin gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div ref={lineRef} className="h-full grad-bg" style={{ width: "0%" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 pt-32 md:pt-40 pb-24">
        <div
          ref={labelRef}
          className="font-mono text-xs md:text-sm text-muted tracking-[0.25em] uppercase mb-6 flex items-center gap-3"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="inline-block h-px w-8 grad-bg" />
          GUILHERME AIRES — NOC / DEVOPS / DEV
        </div>

        {/* Headline wrapper: NO overflow:hidden, generous min-height to avoid layout shift */}
        <div
          ref={headlineRef}
          className="mb-10 w-full"
          style={{
            willChange: "transform",
            overflow: "visible",
            minHeight: "clamp(3.4rem, 9vw, 10rem)",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          <DrawingHeadline />
        </div>

        <p
          ref={subRef}
          className="max-w-2xl text-base md:text-lg text-muted leading-relaxed mb-10"
          style={{ willChange: "transform" }}
        >
          Profissional de TI com atuação em NOC, DevOps e desenvolvimento
          de software. São Paulo, Brasil.
        </p>

        <div
          ref={ctasRef}
          className="flex flex-wrap gap-4"
          style={{ willChange: "transform" }}
        >
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#projects"
            className="inline-flex items-center gap-2 grad-bg text-black font-medium px-6 py-3 rounded-md font-display tracking-tight glow-grad"
          >
            Ver Projetos
            <span aria-hidden>→</span>
          </motion.a>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="grad-border rounded-md inline-flex items-center gap-2 px-6 py-3 text-white font-display tracking-tight bg-black/20"
          >
            Entre em Contato
          </motion.a>
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
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase">
          scroll
        </span>
        <div className="h-10 w-px relative overflow-hidden">
          <div className="absolute top-0 h-4 w-full grad-bg pulse-grad" />
        </div>
      </div>

      {/* Top-right tag */}
      <div className="absolute top-6 right-6 md:top-8 md:right-12 z-30 font-mono text-[10px] md:text-xs text-muted tracking-widest">
        // portfolio · v2.0
      </div>
    </section>
  );
}
