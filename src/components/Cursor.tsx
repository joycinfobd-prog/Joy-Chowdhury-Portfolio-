import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/** Soft trailing ring + dot cursor accent (desktop / fine pointers only). */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const hot = (e.target as HTMLElement).closest("a, button, [data-hover]");
      gsap.to(ring, {
        scale: hot ? 2.1 : 1,
        opacity: hot ? 0.9 : 0.55,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: hot ? 0.4 : 1, duration: 0.35 });
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full border-[1.5px] border-gblue/70 mix-blend-multiply print:hidden"
        style={{ opacity: 0.55 }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-gred print:hidden"
      />
    </>
  );
}
