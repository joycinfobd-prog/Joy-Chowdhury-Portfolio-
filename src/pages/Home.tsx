import { useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Download, MapPin, Sparkles } from "lucide-react";
import { navLinks } from "../data/defaults";
import { useContent } from "../lib/content";
import { accents } from "../lib/accents";
import Marquee from "../components/Marquee";
import PortraitFrame from "../components/PortraitFrame";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

type StatItem = { value: number; suffix: string; label: string; color: string };

/* ------------------------------ stat counter ------------------------------ */
function Stat({ value, suffix, label, color }: StatItem) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => (el.textContent = String(Math.round(obj.v))),
      });
    });
    return () => ctx.revert();
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <span className={`font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${color}`}>
        <span ref={ref}>0</span>
        {suffix}
      </span>
      <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-gray-500">
        {label}
      </span>
    </div>
  );
}

/* --------------------------------- page ----------------------------------- */
export default function Home() {
  const { profile, stats, highlights } = useContent();
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" }, delay: 0.1 })
        .fromTo("[data-h='badge']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(
          "[data-h='line']",
          { y: 64, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.12 },
          "-=0.35"
        )
        .fromTo("[data-h='role']", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.55")
        .fromTo("[data-h='tag']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, "-=0.6")
        .fromTo("[data-h='cta']", { y: 22, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.09 }, "-=0.5")
        .fromTo("[data-h='stat']", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, "-=0.4")
        .fromTo(
          "[data-h='card']",
          { y: 70, opacity: 0, scale: 0.92, filter: "blur(12px)" },
          { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" },
          "-=1.15"
        )
        .fromTo("[data-h='chip']", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.2)", stagger: 0.08 }, "-=0.6");

      gsap.to("[data-h='card']", { y: -12, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });
    }, root);
    return () => ctx.revert();
  }, []);

  const pages = navLinks.slice(1);
  const pageBlurbs: Record<string, string> = {
    "/about": "My professional profile, story and what drives the work.",
    "/skills": "AI prompting, accounting, marketing and the tools I use daily.",
    "/experience": "Board directorship, accounting operations and freelance work.",
    "/certifications": "Grameenphone Academy certification and national recognition.",
    "/education": "BBA in Accounting, HSC, SSC and the languages I speak.",
    "/contact": "Phone, email, address and a direct message form.",
  };
  const pageAccents = ["gblue", "gred", "gyellow", "ggreen", "gblue", "gred"] as const;

  return (
    <div ref={root}>
      {/* ================================ HERO ================================= */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        <div className="dot-grid absolute inset-0 -z-10" aria-hidden />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:gap-14 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          {/* ------------------------------ copy ------------------------------ */}
          <div>
            <div data-h="badge" className="glass-soft inline-flex flex-wrap items-center gap-2.5 rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-ggreen animate-pulse-dot" />
              <span className="text-xs font-semibold tracking-wide text-inksoft">{profile.availability}</span>
              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />
              <span className="hidden items-center gap-1 text-xs font-medium text-gray-500 sm:flex">
                <MapPin className="h-3 w-3" /> {profile.locationShort}
              </span>
            </div>

            <h1 className="mt-6 font-display font-extrabold tracking-[-0.04em] text-ink">
              <span data-h="line" className="block text-[15vw] leading-[0.95] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                {profile.firstName}
              </span>
              <span data-h="line" className="text-google block text-[15vw] leading-[0.95] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                {profile.lastName}
                <span className="text-ink">.</span>
              </span>
            </h1>

            <p data-h="role" className="mt-5 font-display text-base font-bold leading-snug text-ink sm:text-lg">
              {profile.roleLineA} <span className="text-gray-300">·</span>{" "}
              <span className="text-google">{profile.roleLineB}</span>
            </p>

            <p data-h="tag" className="mt-4 max-w-xl text-[15px] leading-relaxed text-inksoft sm:text-base">
              {profile.tagline}
            </p>
            <p data-h="tag" className="mt-2.5 flex items-center gap-2 text-[13px] font-semibold italic text-gray-400">
              <Sparkles className="h-3.5 w-3.5 text-gyellow not-italic" />
              {profile.motto}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                data-h="cta"
                onClick={() => navigate("/cv")}
                className="shine group flex items-center gap-2.5 rounded-full bg-gblue px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-gblue/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-gblue/50"
              >
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Download CV
              </button>
              <Link
                data-h="cta"
                to="/contact"
                className="glass group flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40"
              >
                Contact Me
                <ArrowRight className="h-4 w-4 text-gblue transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div data-h="stat" className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-gray-200/70 pt-8 sm:grid-cols-4">
              {stats.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* ----------------------------- visual ----------------------------- */}
          <div data-h="card">
            <PortraitFrame />
          </div>
        </div>
      </section>

      {/* =============================== MARQUEE =============================== */}
      <div className="mt-12 px-5 sm:mt-16 sm:px-6">
        <Marquee />
      </div>

      {/* ============================== HIGHLIGHTS ============================= */}
      <section className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="At a glance"
            title="What I bring to"
            highlight="the table"
            sub="A quick snapshot of the roles, certifications and systems I've built."
          />

          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" stagger={0.12} y={56}>
            {highlights.map((h) => {
              const a = accents[h.color];
              return (
                <article key={h.title} className={`glass lift group rounded-[1.6rem] p-6 ${a.glow}`}>
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                    <h.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-5 font-display text-[15px] font-bold text-ink">{h.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-inksoft">{h.detail}</p>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ============================ EXPLORE PAGES ============================ */}
      <section className="px-5 pb-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Explore"
            title="Everything, on"
            highlight="its own page"
            sub="Each section of my CV lives on a dedicated page — pick where you'd like to start."
          />

          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} y={56}>
            {pages.map((page, i) => {
              const a = accents[pageAccents[i]];
              return (
                <Link
                  key={page.to}
                  to={page.to}
                  className={`glass lift group relative flex flex-col overflow-hidden rounded-[1.6rem] p-6 ${a.glow}`}
                >
                  <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar} opacity-70`} />
                  <div className="flex items-start justify-between">
                    <span className={`font-mono text-xs font-bold ${a.text}`}>{page.index}</span>
                    <ArrowUpRight className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gblue" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight text-ink">{page.label}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-inksoft">{pageBlurbs[page.to]}</p>
                  <span className={`mt-5 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${a.chip}`}>
                    View page
                  </span>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
