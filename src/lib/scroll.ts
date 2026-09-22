import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Initialize Lenis smooth scrolling, wired into GSAP's ticker + ScrollTrigger. */
export function initSmoothScroll(): () => void {
  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Jump instantly to the top — used on route change. */
export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/** Smooth animated scroll to top (footer button). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Smooth scroll to an in-page anchor. */
export function scrollTo(target: string) {
  if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
