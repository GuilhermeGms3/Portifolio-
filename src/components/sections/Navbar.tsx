import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/components/contact/ContactModalContext";

const LINKS = [
  { label: "Sobre", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Projetos", href: "#projects" },
  { label: "Trajetória", href: "#experience" },
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
          background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 md:h-18 flex items-center justify-between">
          {/* Left: monogram + name */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm tracking-tight"
              style={{
                background: "linear-gradient(135deg, #1A6EFF 0%, #00B4D8 100%)",
                boxShadow: "0 4px 18px rgba(26,110,255,0.35)",
              }}
            >
              GA
            </div>
            <span className="font-display font-semibold text-white tracking-tight hidden sm:inline">
              Guilherme Aires
            </span>
          </a>

          {/* Right: links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="relative font-mono text-[12px] tracking-[0.18em] uppercase text-white/75 hover:text-white transition-colors group"
              >
                {l.label}
                <span
                  className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: "linear-gradient(90deg,#1A6EFF,#00B4D8)" }}
                />
              </a>
            ))}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={openModal}
              className="grad-border rounded-md px-4 py-2 font-mono text-[12px] tracking-[0.18em] uppercase text-white"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              Contato
            </motion.button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden h-10 w-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[80] md:hidden flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(10,10,10,0.98)", backdropFilter: "blur(14px)" }}
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                openModal();
              }}
              className="grad-border rounded-md px-6 py-3 font-display text-white"
            >
              Contato
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
