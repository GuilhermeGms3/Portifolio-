import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "Initializing system...",
  "Loading kernel modules...",
  "Mounting filesystems...",
  "Starting network services...",
  "Connecting to NOC infrastructure",
  "Loading developer environment...",
  "Welcome, Guilherme Aires_",
];

const HEADLINES = [
  "NOC Analyst. DevOps Engineer. Developer.",
  "Infraestrutura que não dorme. Código que não falha.",
  "Do terminal à produção — eu cuido do caminho.",
  "Monitoramento, automação e desenvolvimento full stack.",
];

function LiveClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="font-terminal text-xs md:text-sm text-terminal/70 tracking-widest">
      SYS_TIME: <span className="text-terminal glow-text">{time}</span>
    </div>
  );
}

function BootSequence({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // Flicker
      tl.to(containerRef.current, { opacity: 0, duration: 0.05 })
        .to(containerRef.current, { opacity: 1, duration: 0.05 })
        .to(containerRef.current, { opacity: 0, duration: 0.05 })
        .to(containerRef.current, { opacity: 1, duration: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return;
    const line = BOOT_LINES[visibleLines];
    if (typedChars < line.length) {
      const t = setTimeout(() => setTypedChars((c) => c + 1), 18);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setTypedChars(0);
    }, 120);
    return () => clearTimeout(t);
  }, [typedChars, visibleLines]);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          y: -40,
          filter: "blur(12px)",
          duration: 0.8,
          ease: "power2.in",
          onComplete: onDone,
        });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [visibleLines, onDone]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 flex items-start justify-start p-6 md:p-12 font-terminal text-sm md:text-base text-terminal"
    >
      <div className="space-y-1">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-3 glow-text">
            <span className="text-terminal/60">&gt;</span>
            <span>{line}</span>
            <span className="text-terminal-bright ml-2">[OK]</span>
          </div>
        ))}
        {visibleLines < BOOT_LINES.length && (
          <div className="flex gap-3 glow-text">
            <span className="text-terminal/60">&gt;</span>
            <span>
              {BOOT_LINES[visibleLines].slice(0, typedChars)}
              <span className="inline-block w-2 h-4 bg-terminal align-middle animate-pulse" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function RotatingHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const variants = [
    { initial: { x: -60, opacity: 0, filter: "blur(8px)" }, animate: { x: 0, opacity: 1, filter: "blur(0px)" }, exit: { x: 60, opacity: 0, filter: "blur(8px)" } },
    { initial: { opacity: 0, filter: "blur(16px)", scale: 1.05 }, animate: { opacity: 1, filter: "blur(0px)", scale: 1 }, exit: { opacity: 0, filter: "blur(16px)", scale: 0.95 } },
    { initial: { y: 30, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -30, opacity: 0 } },
    { initial: { x: 60, opacity: 0, filter: "blur(8px)" }, animate: { x: 0, opacity: 1, filter: "blur(0px)" }, exit: { x: -60, opacity: 0, filter: "blur(8px)" } },
  ];
  const v = variants[idx % variants.length];

  return (
    <div className="relative h-[3.2em] md:h-[2.4em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
          key={idx}
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-terminal-bright glow-text-strong"
        >
          {HEADLINES[idx]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const [bootDone, setBootDone] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bootDone) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
      });
    }, heroRef);
    return () => ctx.revert();
  }, [bootDone]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden border-b border-terminal/15"
    >
      {!bootDone && <BootSequence onDone={() => setBootDone(true)} />}

      {bootDone && (
        <div ref={heroRef} className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 pt-32 md:pt-40 pb-24">
          <div className="hero-reveal font-terminal text-terminal/80 text-sm md:text-base mb-6 tracking-wide">
            guilherme@portfolio:~$ <span className="blink-caret" />
          </div>

          <div className="hero-reveal mb-8">
            <RotatingHeadline />
          </div>

          <p className="hero-reveal max-w-2xl text-base md:text-lg text-foreground/80 mb-10 leading-relaxed">
            Analista NOC &amp; DevOps com experiência em infraestrutura,
            automação e desenvolvimento de software.
          </p>

          <div className="hero-reveal flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 border border-terminal px-6 py-3 font-terminal text-terminal hover:bg-terminal hover:text-background transition-colors glow-box-sm"
            >
              <span className="text-terminal/60 group-hover:text-background/70">$</span>
              ./ver_projetos
              <span className="ml-1 inline-block w-2 h-4 bg-current animate-pulse" />
            </a>
            <a
              href="https://wa.me/55XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-terminal/30 px-6 py-3 font-terminal text-terminal/70 hover:text-terminal hover:border-terminal/70 transition-colors"
            >
              <span className="text-terminal/40">$</span>
              ./falar_comigo --whatsapp
            </a>
          </div>

          <div className="hero-reveal mt-16 flex items-center gap-3 text-xs font-terminal text-terminal/50">
            <span className="inline-block h-2 w-2 rounded-full bg-terminal animate-pulse glow-box-sm" />
            session active &middot; uptime: continuous
          </div>
        </div>
      )}

      {/* bottom-right clock */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30">
        <LiveClock />
      </div>

      {/* top-left tag */}
      <div className="absolute top-6 left-6 md:top-8 md:left-12 z-30 font-terminal text-xs text-terminal/60">
        [ portfolio.local ] :: tty1
      </div>
    </section>
  );
}
