export function ScanlineOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[60] scanlines mix-blend-overlay" />
      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-[60] crt-vignette" />
      {/* Moving scanline */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-[3px] bg-gradient-to-b from-transparent via-[rgb(0_255_65_/_0.18)] to-transparent animate-scanline-move" />
    </>
  );
}
