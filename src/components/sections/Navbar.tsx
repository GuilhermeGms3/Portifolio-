import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/components/contact/ContactModalContext";

const LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#services" },
  { label: "Soluções", href: "#solutions" },
  { label: "Processo", href: "#process" },
  { label: "Stack", href: "#skills" },
];

export function Navbar() {
  const { openModal } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-[90] transition-colors duration-300"
        style={{
          background: scrolled ? "rgba(5,5,5,0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 md:h-18 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <div
              className="h-9 w-9 rounded-md flex items-center justify-center font-display font-bold text-white text-sm tracking-tight"
              style={{
                background: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              GA
            </div>
            <span className="font-display font-semibold text-ink tracking-tight hidden sm:inline">
              Guilherme Aires
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="relative font-mono text-[11px] tracking-[0.20em] uppercase text-ink-2 hover:text-ink transition-colors group"
              >
                {l.label}
                <span
                  className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: "linear-gradient(90deg,#FAFAFA,#52525B)" }}
                />
              </a>
            ))}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={openModal}
              className="grad-border rounded-md px-4 py-2 font-mono text-[11px] tracking-[0.20em] uppercase text-ink"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              Contato
            </motion.button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden h-10 w-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[80] md:hidden flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(5,5,5,0.98)", backdropFilter: "blur(14px)" }}
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl text-ink"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                openModal();
              }}
              className="grad-border rounded-md px-6 py-3 font-display text-ink"
            >
              Contato
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
