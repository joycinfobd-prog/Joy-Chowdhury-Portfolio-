import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Heart, Wrench } from "lucide-react";
import { useContent } from "../lib/content";
import { accents, type Accent } from "../lib/accents";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

/* animated proficiency bar */
function Bar({ name, level, accent }: { name: string; level: number; accent: Accent }) {
  const fill = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = fill.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        }
      );
      const obj = { v: 0 };
      gsap.to(obj, {
        v: level,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => {
          if (num.current) num.current.textContent = `${Math.round(obj.v)}%`;
        },
      });
    });
    return () => ctx.revert();
  }, [level]);

  const a = accents[accent];
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-ink">{name}</span>
        <span ref={num} className={`font-mono text-[11px] font-bold ${a.text}`}>
          0%
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/70">
        <span ref={fill} className={`block h-full rounded-full bg-gradient-to-r ${a.bar}`} style={{ width: 0 }} />
      </div>
    </li>
  );
}

export default function Skills() {
  const { skillCategories, softSkills, softwareTools } = useContent();
  return (
    <PageShell
      eyebrow="Skills & Competencies"
      title="The toolkit behind"
      highlight="the results"
      intro="From prompt frameworks and LLM quality control to double-entry accounting and campaign strategy — here's what I work with every day."
    >
      {/* ---------------------------- categories ---------------------------- */}
      <Reveal className="mt-14 grid gap-5 sm:grid-cols-2" stagger={0.13} y={60}>
        {skillCategories.map((cat) => {
          const a = accents[cat.accent];
          return (
            <article key={cat.title} className={`glass lift group relative overflow-hidden rounded-[1.8rem] p-7 ${a.glow}`}>
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar} opacity-70`} />
              <div className="flex items-start gap-4">
                <span className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <cat.icon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">{cat.title}</h2>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-500">{cat.blurb}</p>
                </div>
              </div>

              <ul className="mt-6 flex flex-col gap-4">
                {cat.skills.map((s) => (
                  <Bar key={s.name} name={s.name} level={s.level} accent={cat.accent} />
                ))}
              </ul>

              {cat.extraTools && cat.extraTools.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-gray-200/70 pt-4">
                  {cat.extraTools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg bg-gray-100/80 px-2.5 py-1.5 font-mono text-[10.5px] font-medium text-gray-500 transition-colors group-hover:text-ink"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {cat.ctaLabel && (
                <a
                  href={cat.ctaHref}
                  className={`mt-5 flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-[12.5px] font-bold transition-all duration-300 hover:-translate-y-0.5 ${a.chip}`}
                >
                  {cat.ctaLabel}
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
              )}
            </article>
          );
        })}
      </Reveal>

      {/* ------------------------- tools + soft skills ------------------------ */}
      <Reveal className="mt-6 grid gap-5 lg:grid-cols-2" stagger={0.14} y={56}>
        <div className="glass rounded-[1.8rem] p-6 sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink">
            <Wrench className="h-4 w-4 text-gblue" /> Software & Tools
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {softwareTools.map((tool) => (
              <span
                key={tool}
                className="rounded-xl border border-gray-200/70 bg-white/75 px-3 py-2 font-mono text-[11.5px] font-medium text-inksoft transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40 hover:text-gblue"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-[1.8rem] p-6 sm:p-7">
          <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-ggreen/15 blur-2xl" />
          <h2 className="relative flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink">
            <Heart className="h-4 w-4 text-ggreen" /> Soft Skills & Leadership
          </h2>
          <div className="relative mt-5 flex flex-wrap gap-2">
            {softSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 rounded-xl border border-ggreen/25 bg-ggreen/8 px-3 py-2 text-[11.5px] font-semibold text-ggreen"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ggreen" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
