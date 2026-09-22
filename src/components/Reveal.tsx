import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay between each direct child (stagger). */
  stagger?: number;
  /** Vertical offset (px) children float up from. */
  y?: number;
  /** Extra delay before the group starts. */
  delay?: number;
  /** Render as a different tag (section, ul, …). */
  as?: ElementType;
  /** Start point of the ScrollTrigger. */
  start?: string;
};

/**
 * Step-by-step scroll reveal: each direct child floats up with a
 * liquid blur→sharp opacity transition, staggered sequentially.
 */
export default function Reveal({
  children,
  className,
  stagger = 0.12,
  y = 48,
  delay = 0,
  as: Tag = "div",
  start = "top 86%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { y, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [stagger, y, delay, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
