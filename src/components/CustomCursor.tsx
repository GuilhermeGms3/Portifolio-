import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea")) {
        gsap.to(cursor, { scale: 1.6, duration: 0.2 });
        gsap.to(ring, { scale: 2, opacity: 0.8, duration: 0.2 });
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.2 });
        gsap.to(ring, { scale: 1, opacity: 0.4, duration: 0.2 });
      }
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
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-2 bg-terminal glow-box-sm hidden md:block"
        style={{ animation: "blink 1.1s steps(2) infinite" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-6 w-6 rounded-full border border-terminal/40 hidden md:block"
      />
    </>
  );
}
