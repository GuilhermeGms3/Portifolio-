/**
 * SideAmbient — fixed ambient background framing the page on the left and right.
 *
 * - Dotted matrix grid (CSS radial gradients)
 * - Soft drifting luminous blurred blobs (restrained palette)
 * - Masked so the center stays dark and readable
 * - pointer-events: none, behind all content
 */
export function SideAmbient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <SideLayer side="left" />
      <SideLayer side="right" />
    </div>
  );
}

function SideLayer({ side }: { side: "left" | "right" }) {
  // Mask: visible at the edge, fades to transparent toward the center.
  const mask =
    side === "left"
      ? "linear-gradient(to right, #000 0%, #000 18%, rgba(0,0,0,0.55) 32%, transparent 52%)"
      : "linear-gradient(to left,  #000 0%, #000 18%, rgba(0,0,0,0.55) 32%, transparent 52%)";

  // Reverse animation direction on the right so the two sides feel coherent but not mirrored.
  const reverse = side === "right";

  return (
    <div
      className="absolute inset-y-0 hidden md:block"
      style={{
        left: side === "left" ? 0 : "auto",
        right: side === "right" ? 0 : "auto",
        width: "42vw",
        maxWidth: 760,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      {/* Dotted matrix grid */}
      <div
        className="absolute inset-0 ambient-grid"
        style={{
          opacity: 0.55,
          animation: `ambient-grid-drift 60s linear ${reverse ? "reverse" : "normal"} infinite`,
        }}
      />

      {/* Subtle scan line gradient — adds depth without color */}
      <div
        className="absolute inset-0"
        style={{
          background:
            side === "left"
              ? "linear-gradient(to right, rgba(255,255,255,0.025), transparent 70%)"
              : "linear-gradient(to left, rgba(255,255,255,0.025), transparent 70%)",
        }}
      />

      {/* Blurred luminous shapes — restrained palette */}
      <Blob
        size={520}
        top="8%"
        offset="-12%"
        side={side}
        color="rgba(26, 110, 255, 0.18)" /* cold blue */
        duration={28}
        delay={0}
      />
      <Blob
        size={380}
        top="34%"
        offset="6%"
        side={side}
        color="rgba(0, 180, 216, 0.12)" /* cyan */
        duration={36}
        delay={-8}
      />
      <Blob
        size={460}
        top="62%"
        offset="-4%"
        side={side}
        color="rgba(91, 33, 182, 0.14)" /* subtle purple */
        duration={42}
        delay={-14}
      />
      <Blob
        size={300}
        top="82%"
        offset="14%"
        side={side}
        color="rgba(20, 184, 166, 0.08)" /* dim teal */
        duration={50}
        delay={-22}
      />
      <Blob
        size={260}
        top="20%"
        offset="22%"
        side={side}
        color="rgba(245, 158, 11, 0.05)" /* muted amber */
        duration={64}
        delay={-30}
      />
    </div>
  );
}

function Blob({
  size,
  top,
  offset,
  side,
  color,
  duration,
  delay,
}: {
  size: number;
  top: string;
  offset: string;
  side: "left" | "right";
  color: string;
  duration: number;
  delay: number;
}) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        top,
        [side]: offset,
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 65%)`,
        filter: "blur(60px)",
        animation: `ambient-float ${duration}s ease-in-out ${delay}s infinite alternate`,
        willChange: "transform, opacity",
      } as React.CSSProperties}
    />
  );
}
