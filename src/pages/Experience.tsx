import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, Check } from "lucide-react";
import { useContent } from "../lib/content";
import { accents } from "../lib/accents";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const { experience } = useContent();
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <PageShell
      eyebrow="Work Experience"
      title="Where I've worked and"
      highlight="what I built"
      intro="From board-level governance and audit-ready accounting systems to AI-powered marketing workflows and commercial photography."
    >
      <div ref={wrap} className="relative mt-14">
        {/* spine */}
        <div className="absolute left-[1.4rem] top-0 h-full w-px bg-gray-200/80" />
        <div
          ref={line}
          className="absolute left-[1.4rem] top-0 h-full w-[3px] origin-top -translate-x-[1px] rounded-full bg-gradient-to-b from-gblue via-gyellow to-ggreen"
          style={{ transform: "scaleY(0)" }}
        />

        <div className="flex flex-col gap-6 sm:gap-8">
          {experience.map((job) => {
            const a = accents[job.color];
            return (
              <div key={job.role} className="relative pl-14 sm:pl-20">
                {/* node */}
                <span className={`absolute left-[1.4rem] top-8 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-white shadow-md ring-4 ring-white`}>
                  <span className={`grid h-full w-full place-items-center rounded-full ${a.bgSoft} ${a.text} ring-1 ${a.ring}`}>
                    <job.icon className="h-4 w-4" />
                  </span>
                </span>

                <Reveal y={56}>
                  <article className={`glass lift group rounded-[1.8rem] p-6 sm:p-8 ${a.glow} ${job.current ? "ring-2 ring-ggreen/30" : ""}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] ${a.chip}`}>
                          {job.type}
                        </span>
                        <h2 className="mt-3 font-display text-lg font-extrabold leading-snug tracking-tight text-ink sm:text-xl">
                          {job.role}
                        </h2>
                        <p className={`mt-1.5 text-[13.5px] font-bold ${a.text}`}>{job.company}</p>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        {job.current && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-ggreen/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ggreen ring-1 ring-ggreen/25">
                            <span className="h-1.5 w-1.5 rounded-full bg-ggreen animate-pulse-dot" />
                            Current
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {job.period}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-6 flex flex-col gap-3">
                      {job.points.map((p, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${a.bgSoft}`}>
                            <Check className={`h-3 w-3 ${a.text}`} strokeWidth={3} />
                          </span>
                          <span className="text-[13.5px] leading-relaxed text-inksoft">{p}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-gray-200/70 pt-5">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-gray-100/80 px-2.5 py-1.5 font-mono text-[10.5px] font-medium text-gray-500 transition-colors group-hover:text-ink"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
