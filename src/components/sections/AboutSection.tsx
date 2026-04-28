import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES: Array<[string, string]> = [
  ["Name", "Guilherme Aires"],
  ["Role", "NOC Analyst | DevOps | Developer"],
  ["Location", "São Paulo, Brasil"],
  ["Status", "Disponível para freelas"],
  ["GitHub", "github.com/GuilhermeGms3"],
  ["LinkedIn", "guilherme-aires-gomes"],
];

function Typewriter({ start }: { start: boolean }) {
  const [shown, setShown] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    let cancelled = false;
    const lines = TERMINAL_LINES.map(([k, v]) => `${k.padEnd(9)}: ${v}`);
    (async () => {
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        for (let ci = 0; ci <= line.length; ci++) {
          if (cancelled) return;
          setCurrent(line.slice(0, ci));
          await new Promise((r) => setTimeout(r, 18));
        }
        setShown((p) => [...p, line]);
        setCurrent("");
        await new Promise((r) => setTimeout(r, 90));
      }
      setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [start]);

  return (
    <pre className="font-mono text-[13px] leading-relaxed text-white/90 whitespace-pre-wrap">
      <span className="text-muted">{"> whoami"}</span>
      {"\n\n"}
      {shown.map((l, i) => {
        const [, v] = l.split(/:(.+)/);
        const k = l.split(":")[0];
        return (
          <span key={i}>
            <span className="text-blue">{k}</span>
            <span className="text-muted">:</span>
            <span style={{ color: "#e2e8f0" }}>{v}</span>
            {"\n"}
          </span>
        );
      })}
      <span style={{ color: "#e2e8f0" }}>{current}</span>
      <span
        className="inline-block w-2 h-3 align-middle ml-0.5"
        style={{
          background: "#1A6EFF",
          opacity: done ? 0 : 1,
          animation: "blink 1s infinite",
        }}
      />
      <style>{`@keyframes blink {0%,49%{opacity:1}50%,100%{opacity:0}}`}</style>
    </pre>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        },
      );
      gsap.fromTo(
        rightRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
            onEnter: () => setTimeout(() => setTyping(true), 600),
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 md:py-40 px-6 md:px-12 grid-dots"
      style={{ background: "#0d1117" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          sobre
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* LEFT */}
          <div ref={leftRef} style={{ willChange: "transform, opacity" }}>
            <h2
              className="font-display font-bold tracking-tight leading-[1.05] mb-8"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                background: "linear-gradient(90deg, #1A6EFF 0%, #00B4D8 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Eu conecto infraestrutura e código.
            </h2>

            <div className="space-y-5 text-white/85 leading-relaxed">
              <p>
                Sou Analista de NOC, DevOps Engineer e desenvolvedor de software.
                Atuo onde a infraestrutura encontra o código — diagnosticando
                falhas, automatizando rotinas e construindo sistemas que
                funcionam de ponta a ponta.
              </p>
              <p>
                Tenho passagem por suporte N2 em ambiente corporativo, com
                gestão de incidentes críticos, monitoramento de redes e
                administração Linux. Hoje aprofundo CI/CD, containerização e
                IaC com Docker, Kubernetes e Terraform.
              </p>
              <p>
                Em paralelo, desenvolvo aplicações em Python, TypeScript, Java
                Spring Boot e React — fechando o ciclo entre operação e
                produto.
              </p>
            </div>
          </div>

          {/* RIGHT — terminal card */}
          <div ref={rightRef} style={{ willChange: "transform, opacity" }}>
            <div
              className="rounded-xl overflow-hidden backdrop-blur-md"
              style={{
                border: "1px solid rgba(26,110,255,0.3)",
                background: "rgba(10,10,10,0.92)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="font-mono text-[11px] text-muted ml-2 px-2 py-0.5 rounded bg-white/5">
                  guilherme@dev:~
                </div>
              </div>
              <div className="p-5 md:p-6 min-h-[280px]">
                <Typewriter start={typing} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
