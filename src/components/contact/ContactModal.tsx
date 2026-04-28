import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContactModal } from "./ContactModalContext";

const LINKS = [
  { label: "GitHub", handle: "GuilhermeGms3", url: "https://github.com/GuilhermeGms3", icon: "GH" },
  { label: "LinkedIn", handle: "guilherme-aires", url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341", icon: "in" },
  { label: "WhatsApp", handle: "Enviar mensagem", url: "https://wa.me/5561991771324", icon: "Wa" },
];

export function ContactModal() {
  const { open, closeModal } = useContactModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeModal]);

  // reset on close
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setSent(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 350);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] rounded-2xl overflow-hidden"
            style={{
              background: "#0d1117",
              border: "1px solid rgba(26,110,255,0.3)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(26,110,255,0.15)",
            }}
          >
            {/* gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-px grad-bg" />

            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </motion.button>

            <div className="p-7 md:p-9">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-2 flex items-center gap-3">
                <span className="inline-block h-px w-8 grad-bg" />
                contato
              </div>
              <h3 className="font-display font-semibold text-3xl text-white tracking-tight">
                Vamos <span className="grad-text">Conversar</span>
              </h3>
              <p className="text-sm text-muted mt-1.5 mb-6">Respondo em até 24h.</p>

              {/* direct contact pills */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {LINKS.map((l) => (
                  <motion.a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    className="grad-border rounded-lg px-2 py-3 text-center group"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="font-mono text-[10px] grad-text font-semibold mb-1">{l.icon}</div>
                    <div className="font-mono text-[10px] text-white truncate">{l.label}</div>
                    <div className="font-mono text-[9px] text-muted truncate">{l.handle}</div>
                  </motion.a>
                ))}
              </div>

              <div className="h-px w-full grad-bg opacity-40 mb-6" />

              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    {[
                      { v: name, set: setName, ph: "Nome", type: "text" },
                      { v: email, set: setEmail, ph: "Email", type: "email" },
                      { v: subject, set: setSubject, ph: "Assunto", type: "text" },
                    ].map((f) => (
                      <input
                        key={f.ph}
                        required
                        type={f.type}
                        value={f.v}
                        onChange={(e) => f.set(e.target.value)}
                        placeholder={f.ph}
                        className="contact-input"
                      />
                    ))}
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mensagem"
                      className="contact-input resize-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full font-display font-medium tracking-tight rounded-lg px-6 py-3.5 text-black"
                      style={{ background: "linear-gradient(90deg, #1A6EFF 0%, #00B4D8 100%)" }}
                    >
                      Enviar Mensagem
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-sm space-y-1.5 py-6"
                  >
                    <div className="grad-text">{"> Mensagem enviada com sucesso."}</div>
                    <div className="grad-text">{"> Retorno em breve, Guilherme."}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
