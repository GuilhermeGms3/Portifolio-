/**
 * Atmospheric overlays: subtle film grain + faint vignette.
 * No scanlines — the new design avoids terminal/CRT aesthetic.
 */
export function ScanlineOverlay() {
  return (
    <>
      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[60] noise opacity-[0.04] mix-blend-overlay"
        aria-hidden
      />
      {/* soft vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[60]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgb(0 0 0 / 0.55) 100%)",
        }}
      />
    </>
  );
}
