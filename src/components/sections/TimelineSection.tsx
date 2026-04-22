import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Commit = {
  date: string;
  hash: string;
  title: string;
  body: string;
};

const COMMITS: Commit[] = [
  {
    date: "2024",
    hash: "a3f2c1b",
    title: "Analista NOC",
    body: "Monitoramento de infraestrutura, gestão de incidentes e suporte técnico N2/N3.",
  },
  {
    date: "2023",
    hash: "7d9e4f2",
    title: "DevOps & Automação",
    body: "Automação de processos com Shell Script, implementação de firewalls e containers.",
  },
  {
    date: "ongoing",
    hash: "HEAD",
    title: "Desenvolvimento de Software",
    body: "Projetos pessoais em Python, JavaScript e Java. Integração de dados e automação.",
  },
];

export function TimelineSection() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalScroll = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${totalScroll() + 200}`,
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(lineRef.current, {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${totalScroll() + 200}`,
          scrub: 1.5,
        },
      });

      // Each node animation
      gsap.utils.toArray<HTMLElement>(".commit-node").forEach((node, i) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: node,
              containerAnimation: ScrollTrigger.getAll().find((t) => t.pin === wrapperRef.current),
              start: "left 60%",
            },
            delay: 0.05 * i,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".commit-detail").forEach((detail) => {
        gsap.fromTo(
          detail,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: detail,
              containerAnimation: ScrollTrigger.getAll().find((t) => t.pin === wrapperRef.current),
              start: "left 70%",
            },
          },
        );
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} id="experience" className="relative h-screen overflow-hidden border-b border-terminal/15">
      <div className="absolute top-12 left-6 md:left-12 z-10 max-w-6xl">
        <div className="font-terminal text-sm text-terminal/70 mb-2">
          guilherme@portfolio:~$
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-terminal-bright glow-text-strong">
          &gt; git log --oneline --career
        </h2>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div ref={trackRef} className="flex items-center gap-24 md:gap-40 pl-12 md:pl-24 pr-24 will-change-transform">
          {/* baseline */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-terminal/10" />
          <div
            ref={lineRef}
            className="absolute left-0 top-1/2 h-px bg-terminal glow-box-sm w-full"
            style={{ transform: "scaleX(0)" }}
          />

          {COMMITS.map((c, i) => (
            <div key={i} className="relative flex-shrink-0 w-[80vw] md:w-[44vw] max-w-[560px] py-20">
              {/* node */}
              <div className="commit-node absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-terminal glow-box" />
                  <div className="absolute inset-0 h-4 w-4 rounded-full bg-terminal animate-ping opacity-40" />
                </div>
              </div>

              {/* card */}
              <div className={`commit-detail terminal-pane scanlines p-5 md:p-6 ${i % 2 === 0 ? "mt-[-220px]" : "mt-[120px]"}`}>
                <div className="flex items-center gap-3 font-terminal text-xs mb-3">
                  <span className="text-terminal/50">[{c.date}]</span>
                  <span className="text-terminal-dim">{c.hash}</span>
                  <span className="text-terminal/30">—</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-terminal-bright glow-text mb-3">
                  {c.title}
                </h3>
                <p className="text-foreground/85 text-sm md:text-base leading-relaxed">
                  {c.body}
                </p>
                {/* connector */}
                <div className={`absolute left-2 ${i % 2 === 0 ? "bottom-[-40px]" : "top-[-40px]"} w-px h-10 bg-terminal/40`} />
              </div>
            </div>
          ))}

          {/* end terminator */}
          <div className="relative flex-shrink-0 w-[20vw] py-20">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 font-terminal text-terminal/60 text-sm whitespace-nowrap pl-2">
              -- end of log --
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-terminal text-xs text-terminal/40">
        scroll →
      </div>
    </section>
  );
}
