import { motion } from "framer-motion";
import { useContactModal } from "@/components/contact/ContactModalContext";

export function Footer() {
  const { openModal } = useContactModal();
  return (
    <footer className="relative px-6 md:px-12 py-12" style={{ background: "#050505" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
      />

      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <div className="font-display font-semibold text-ink tracking-tight">
            Guilherme Aires
          </div>
          <div className="font-mono text-xs text-ink-3 mt-1">
            Desenvolvimento · Automação · Infraestrutura
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          {[
            { label: "GitHub", url: "https://github.com/GuilhermeGms3" },
            { label: "LinkedIn", url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341" },
            { label: "WhatsApp", url: "https://wa.me/5561991771324" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="text-ink-2 hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
          <motion.button
            whileHover={{ y: -1 }}
            onClick={openModal}
            className="grad-border rounded-md px-3 py-1.5 text-ink"
          >
            Orçamento
          </motion.button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-8 pt-6 border-t border-white/5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3 text-center">
        © 2025 Guilherme Aires — São Paulo, Brasil
      </div>
    </footer>
  );
}
