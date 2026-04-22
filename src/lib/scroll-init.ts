import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

/**
 * Initialize global ScrollTrigger defaults once.
 * - anticipatePin: 1 → pinned sections lock without jumping
 * - fastScrollEnd: true → handles fast scroll cleanly
 */
export function initScrollDefaults() {
  if (initialized) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({
    anticipatePin: 1,
    fastScrollEnd: false,
    preventOverlaps: true,
  });
  initialized = true;
}

/**
 * Returns true on viewports < 768px so callers can halve scrub values.
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

/** Scale a desktop scrub value down on mobile (50%). */
export function scrubFor(desktop: number): number {
  return isMobileViewport() ? desktop * 0.5 : desktop;
}
