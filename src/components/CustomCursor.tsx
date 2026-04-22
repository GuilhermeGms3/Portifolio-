import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Soft gradient cursor — a small dot following the pointer with a
 * larger trailing halo. Hidden on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, textarea");
      gsap.to(ring, {
        scale: interactive ? 2.2 : 1,
        opacity: interactive ? 0.9 : 0.5,
        duration: 0.25,
      });
      gsap.to(dot, { scale: interactive ? 0.5 : 1, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full hidden md:block"
        style={{
          background: "linear-gradient(135deg, #1A6EFF, #00FF41)",
          boxShadow: "0 0 12px rgb(26 110 255 / 0.6)",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-8 w-8 rounded-full hidden md:block"
        style={{
          border: "1px solid rgb(255 255 255 / 0.25)",
          opacity: 0.5,
        }}
      />
    </>
  );
}
