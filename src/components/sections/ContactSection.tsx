import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [responseLine, setResponseLine] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    const lines = [
      "> Mensagem recebida. Resposta em breve.",
      "> Connection closed.",
    ];
    let i = 0;
    const id = setInterval(() => {
      i++;
      setResponseLine(lines.slice(0, i).join("\n"));
      if (i >= lines.length) clearInterval(id);
    }, 700);
  }

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 font-terminal text-sm md:text-base">
      <span className="text-terminal/70 shrink-0 pt-2">$</span>
      <span className="text-terminal shrink-0 pt-2 w-20">{label}:</span>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-12 border-b border-terminal/15">
      <div className="mx-auto max-w-3xl">
        <div className="font-terminal text-sm text-terminal/70 mb-3">
          guilherme@portfolio:~$
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-terminal-bright glow-text-strong mb-10">
          &gt; ./contact.sh
        </h2>

        <div className="terminal-pane scanlines">
          <div className="flex items-center justify-between border-b border-terminal/40 px-4 py-2 bg-terminal/5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-terminal/30 border border-terminal/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-terminal/30 border border-terminal/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-terminal/60 border border-terminal" />
            </div>
            <span className="font-terminal text-xs text-terminal/70">
              contact.sh — interactive
            </span>
            <span className="font-terminal text-xs text-terminal/40">pid 1337</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            <Field label="name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-terminal/30 focus:border-terminal outline-none py-1.5 text-foreground caret-terminal placeholder:text-terminal/30 font-terminal"
                placeholder="seu nome"
              />
            </Field>
            <Field label="email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-terminal/30 focus:border-terminal outline-none py-1.5 text-foreground caret-terminal placeholder:text-terminal/30 font-terminal"
                placeholder="seu@email.com"
              />
            </Field>
            <Field label="message">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full bg-transparent border border-terminal/20 focus:border-terminal outline-none p-3 text-foreground caret-terminal placeholder:text-terminal/30 font-terminal resize-none"
                placeholder="digite sua mensagem..."
              />
            </Field>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="inline-flex items-center gap-2 border border-terminal bg-terminal/10 px-6 py-3 font-terminal text-terminal hover:bg-terminal hover:text-background transition-colors glow-box-sm"
              >
                <span className="text-terminal/60">$</span>
                ./send --now
                <span className="ml-1 inline-block w-2 h-4 bg-current animate-pulse" />
              </motion.button>
            </div>

            {sent && (
              <pre className="mt-6 font-terminal text-terminal text-sm whitespace-pre-wrap glow-text">
                {responseLine}
                <span className="inline-block w-2 h-4 bg-terminal align-middle ml-1 animate-pulse" />
              </pre>
            )}
          </form>
        </div>

        {/* Direct links */}
        <div className="mt-10 space-y-2 font-terminal text-sm md:text-base">
          {[
            { cmd: "open linkedin", url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341" },
            { cmd: "open github", url: "https://github.com/GuilhermeGms3" },
            { cmd: "message whatsapp", url: "https://wa.me/55XXXXXXXXXX" },
          ].map((l) => (
            <a
              key={l.cmd}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-terminal/70 hover:text-terminal transition-colors"
            >
              <span className="text-terminal/50">&gt;</span>
              <span className="group-hover:glow-text">{l.cmd}</span>
              <span className="text-terminal/30 group-hover:text-terminal/60 ml-2">
                → {l.url.replace("https://", "")}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
