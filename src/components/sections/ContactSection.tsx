import { FormEvent, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  {
    label: "GitHub",
    handle: "github.com/GuilhermeGms3",
    url: "https://github.com/GuilhermeGms3",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/guilherme-aires-gomes",
    url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341",
  },
  {
    label: "WhatsApp",
    handle: "Enviar mensagem",
    url: "https://wa.me/55XXXXXXXXXX",
  },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        rightRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      const fields = fieldsRef.current?.querySelectorAll<HTMLElement>(".form-field") ?? [];
      gsap.fromTo(
        fields,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
    }, 400);
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 px-6 md:px-12 grid-dots"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-3 flex items-center gap-3">
          <span className="inline-block h-px w-8 grad-bg" />
          contato
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl text-white tracking-tight mb-16">
          Vamos <span className="grad-text">Conversar</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* LEFT */}
          <div ref={leftRef} style={{ willChange: "transform, opacity" }}>
            <p className="font-display font-semibold text-3xl md:text-4xl tracking-tight leading-tight grad-text mb-10">
              Disponível para freelas e novas oportunidades.
            </p>

            <div className="space-y-3">
              {LINKS.map((l) => (
                <motion.a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  className="grad-border glass rounded-lg px-5 py-4 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-display font-semibold text-white">{l.label}</div>
                    <div className="font-mono text-xs text-muted">{l.handle}</div>
                  </div>
                  <span className="font-mono text-xl grad-text group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div ref={rightRef} style={{ willChange: "transform, opacity" }}>
            <form
              ref={fieldsRef}
              onSubmit={handleSubmit}
              className="grad-border glass rounded-xl p-6 md:p-8 space-y-5"
            >
              <div className="form-field">
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted mb-2 block">
                  Nome
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white outline-none focus:border-blue/60 transition-colors"
                  placeholder="Seu nome"
                  style={{ borderColor: undefined }}
                />
              </div>
              <div className="form-field">
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted mb-2 block">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white outline-none focus:border-blue/60 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="form-field">
                <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted mb-2 block">
                  Mensagem
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-white outline-none focus:border-blue/60 resize-none transition-colors"
                  placeholder="Conte sobre o projeto..."
                />
              </div>
              <div className="form-field pt-1">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full grad-bg text-black font-display font-medium tracking-tight rounded-md px-6 py-3.5 glow-grad"
                >
                  Enviar mensagem
                </motion.button>
              </div>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form-field font-mono text-xs grad-text"
                >
                  ✓ Mensagem recebida — resposta em breve.
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
