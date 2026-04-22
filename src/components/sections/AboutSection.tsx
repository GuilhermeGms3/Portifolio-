import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WHOAMI = [
  ["Name", "Guilherme Aires"],
  ["Role", "NOC Analyst | DevOps | Developer"],
  ["Location", "Brasil"],
  ["Status", "Available for freelance"],
  ["GitHub", "github.com/GuilhermeGms3"],
  ["LinkedIn", "linkedin.com/in/guilherme-aires-gomes"],
];

const ABOUT_TEXT =
  "Profissional de TI com atuação em NOC e DevOps, responsável por monitoramento de infraestrutura, resposta a incidentes e automação de processos. Também desenvolvo soluções de software — de scripts de automação a aplicações web completas.";

function useTypeOnVisible(ref: React.RefObject<HTMLElement | null>, text: string, speed = 12) {
  const [out, setOut] = useState("");
  const startedRef = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            let i = 0;
            const id = setInterval(() => {
              i++;
              setOut(text.slice(0, i));
              if (i >= text.length) clearInterval(id);
            }, speed);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, text, speed]);
  return out;
}

function PaneHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-terminal/40 px-4 py-2 bg-terminal/5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-terminal/30 border border-terminal/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-terminal/30 border border-terminal/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-terminal/60 border border-terminal glow-box-sm" />
      </div>
      <span className="font-terminal text-xs text-terminal/70">{title}</span>
      <span className="font-terminal text-xs text-terminal/40">tmux 0:1</span>
    </div>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftBodyRef = useRef<HTMLDivElement>(null);
  const rightBodyRef = useRef<HTMLDivElement>(null);

  const aboutTyped = useTypeOnVisible(rightBodyRef, ABOUT_TEXT, 10);
  const [whoamiIdx, setWhoamiIdx] = useState(-1);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: "-110%", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
      gsap.fromTo(
        rightRef.current,
        { x: "110%", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          onComplete: () => {
            // begin whoami reveal
            let i = 0;
            const id = setInterval(() => {
              i++;
              setWhoamiIdx(i);
              if (i >= WHOAMI.length) clearInterval(id);
            }, 220);
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 md:py-32 px-6 md:px-12 border-b border-terminal/15">
      <div className="mx-auto max-w-7xl">
        <div className="font-terminal text-sm text-terminal/70 mb-8">
          guilherme@portfolio:~$ <span className="text-terminal glow-text">tmux split-window -h</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT pane */}
          <div ref={leftRef} className="terminal-pane scanlines">
            <PaneHeader title="~ /home/guilherme — whoami" />
            <div className="p-5 md:p-6 font-terminal text-sm md:text-base">
              <div className="text-terminal/70 mb-4">
                <span className="text-terminal">&gt;</span> whoami
              </div>
              <div ref={leftBodyRef} className="space-y-2">
                {WHOAMI.slice(0, Math.max(whoamiIdx, 0)).map(([k, v], i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-terminal-dim w-20 shrink-0">{k}</span>
                    <span className="text-terminal/40">:</span>
                    <span className="text-terminal-bright break-all">{v}</span>
                  </div>
                ))}
                {whoamiIdx >= 0 && whoamiIdx < WHOAMI.length && (
                  <div className="text-terminal blink-caret" />
                )}
                {whoamiIdx >= WHOAMI.length && (
                  <div className="pt-3 text-terminal/60">
                    <span className="text-terminal">&gt;</span> _
                    <span className="inline-block w-2 h-4 bg-terminal align-middle ml-1 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT pane */}
          <div ref={rightRef} className="terminal-pane scanlines">
            <PaneHeader title="~ /home/guilherme — cat about.txt" />
            <div className="p-5 md:p-6 font-terminal text-sm md:text-base">
              <div className="text-terminal/70 mb-4">
                <span className="text-terminal">&gt;</span> cat about.txt
              </div>
              <p ref={rightBodyRef} className="leading-relaxed text-foreground/85">
                {aboutTyped}
                {aboutTyped.length < ABOUT_TEXT.length && (
                  <span className="inline-block w-2 h-4 bg-terminal align-middle ml-1 animate-pulse" />
                )}
              </p>
              {aboutTyped.length >= ABOUT_TEXT.length && (
                <div className="mt-6 text-xs text-terminal/50">
                  -- END OF FILE -- (1 file, 412 bytes)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
