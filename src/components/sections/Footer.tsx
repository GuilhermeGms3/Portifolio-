export function Footer() {
  return (
    <footer className="relative px-6 md:px-12 py-10 border-t border-terminal/15">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-4 items-center justify-between font-terminal text-sm text-terminal/70">
        <div className="flex items-center gap-2">
          <span className="text-terminal/50">&gt;</span>
          <span className="text-terminal glow-text">GuilhermeGms3</span>
          <span className="text-terminal/40">© 2025</span>
        </div>
        <div className="text-center text-terminal/60 italic">
          &gt; "Built with caffeine and terminal commands."
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[
            { label: "github", url: "https://github.com/GuilhermeGms3" },
            { label: "linkedin", url: "https://linkedin.com/in/guilherme-aires-gomes-0b5929341" },
            { label: "whatsapp", url: "https://wa.me/55XXXXXXXXXX" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-terminal hover:glow-text transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
