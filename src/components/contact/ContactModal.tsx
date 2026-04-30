import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContactModal } from "./ContactModalContext";

const LINKS = [
  { label: "WhatsApp", handle: "Mensagem direta", url: "https://wa.me/5561991771324", icon: "Wa" },
  { label: "LinkedIn", handle: "guilherme-aires", url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341", icon: "in" },
  { label: "GitHub", handle: "GuilhermeGms3", url: "https://github.com/GuilhermeGms3", icon: "GH" },
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
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[540px] rounded-2xl overflow-hidden"
            style={{
              background: "#0A0A0B",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
            />

            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full flex items-center justify-center text-ink-2 hover:text-ink"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </motion.button>

            <div className="p-7 md:p-9">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-3 mb-2 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-ink-3" />
                contato
              </div>
              <h3 className="font-display font-semibold text-2xl md:text-3xl text-ink tracking-tight">
                Solicitar <span className="grad-text">orçamento</span>
              </h3>
              <p className="text-sm text-ink-2 mt-2 mb-6 leading-relaxed">
                Tem uma ideia, processo manual ou negócio precisando de presença
                digital? Respondo em até 24h.
              </p>

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
                    <div className="font-mono text-[10px] text-ink font-semibold mb-1">{l.icon}</div>
                    <div className="font-mono text-[10px] text-ink truncate">{l.label}</div>
                    <div className="font-mono text-[9px] text-ink-3 truncate">{l.handle}</div>
                  </motion.a>
                ))}
              </div>

              <div className="h-px w-full bg-white/10 mb-6" />

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
                      { v: subject, set: setSubject, ph: "Tipo de projeto", type: "text" },
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
                      placeholder="Conte um pouco sobre o que você precisa"
                      className="contact-input resize-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full font-display font-medium tracking-tight rounded-lg px-6 py-3.5 text-black"
                      style={{
                        background: "linear-gradient(180deg, #FAFAFA 0%, #D4D4D8 100%)",
                        boxShadow: "0 14px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)",
                      }}
                    >
                      Solicitar orçamento
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
                    <div className="text-ink">{"> Mensagem enviada com sucesso."}</div>
                    <div className="text-ink-2">{"> Retorno em até 24h."}</div>
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
