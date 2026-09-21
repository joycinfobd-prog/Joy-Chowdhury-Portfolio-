import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { navLinks } from "../data/defaults";

type Props = {
  eyebrow: string;
  title: string;
  highlight: string;
  intro: string;
  children: ReactNode;
};

/** Shared sub-page layout: numbered hero header, content, prev/next pager. */
export default function PageShell({ eyebrow, title, highlight, intro, children }: Props) {
  const headRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const idx = navLinks.findIndex((l) => l.to === pathname);
  const prev = idx > 0 ? navLinks[idx - 1] : null;
  const next = idx >= 0 && idx < navLinks.length - 1 ? navLinks[idx + 1] : null;
  const current = navLinks[idx] ?? navLinks[0];

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-ph='crumb']", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo("[data-ph='num']", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)" }, "-=0.4")
        .fromTo("[data-ph='title']", { y: 46, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 }, "-=0.55")
        .fromTo("[data-ph='intro']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo("[data-ph='rule']", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "-=0.6");
    }, headRef);
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="pb-8 pt-28 sm:pt-36">
      {/* ------------------------------ page header ----------------------------- */}
      <header ref={headRef} className="relative">
        <div className="dot-grid absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          {/* breadcrumb */}
          <div data-ph="crumb" className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:text-[11px] sm:tracking-[0.18em]">
            <Link to="/" className="transition-colors hover:text-gblue">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gblue">{current.label}</span>
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* big index */}
            <span
              data-ph="num"
              className="glass grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-extrabold text-google sm:h-20 sm:w-20 sm:text-3xl"
            >
              {current.index}
            </span>

            <div className="min-w-0">
              <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-inksoft sm:px-3.5 sm:text-[10.5px] sm:tracking-[0.18em]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gred" />
                {eyebrow}
              </span>
              <h1
                data-ph="title"
                className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl"
              >
                {title} <span className="text-google">{highlight}</span>
              </h1>
              <p data-ph="intro" className="mt-5 max-w-2xl text-[15px] leading-relaxed text-inksoft sm:text-base">
                {intro}
              </p>
            </div>
          </div>

          <div
            data-ph="rule"
            className="mt-10 h-px origin-left bg-gradient-to-r from-gblue via-gyellow to-transparent"
          />
        </div>
      </header>

      {/* -------------------------------- content ------------------------------- */}
      <div className="mx-auto max-w-6xl px-5 sm:px-6">{children}</div>

      {/* --------------------------------- pager -------------------------------- */}
      <nav className="mx-auto mt-14 max-w-6xl px-5 sm:mt-20 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {prev ? (
            <Link
              to={prev.to}
              className="glass lift group flex items-center gap-4 rounded-[1.4rem] p-5 sm:p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100/80 text-inksoft transition-all duration-300 group-hover:bg-gblue group-hover:text-white">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </span>
              <span className="text-left">
                <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Previous · {prev.index}
                </span>
                <span className="block font-display text-base font-bold text-ink">{prev.label}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              to={next.to}
              className="glass lift group flex items-center justify-end gap-4 rounded-[1.4rem] p-5 text-right sm:p-6"
            >
              <span>
                <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Next · {next.index}
                </span>
                <span className="block font-display text-base font-bold text-ink">{next.label}</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100/80 text-inksoft transition-all duration-300 group-hover:bg-gblue group-hover:text-white">
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
