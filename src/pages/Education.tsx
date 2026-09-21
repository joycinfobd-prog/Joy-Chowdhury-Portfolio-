import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Languages as LanguagesIcon, School } from "lucide-react";
import { useContent } from "../lib/content";
import { accents, type Accent } from "../lib/accents";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const hex: Record<Accent, string> = {
  gblue: "#4285F4",
  gred: "#EA4335",
  gyellow: "#FBBC05",
  ggreen: "#34A853",
};

/* circular language proficiency ring */
function Ring({ percent, color, label }: { percent: number; color: Accent; label: string }) {
  const circle = useRef<SVGCircleElement>(null);
  const R = 34;
  const C = 2 * Math.PI * R;

  useLayoutEffect(() => {
    const el = circle.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { strokeDashoffset: C },
        {
          strokeDashoffset: C - (C * percent) / 100,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [percent, C]);

  return (
    <div className="relative grid place-items-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={R} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle
          ref={circle}
          cx="44"
          cy="44"
          r={R}
          fill="none"
          stroke={hex[color]}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <span className="absolute font-display text-sm font-extrabold text-ink">{label}</span>
    </div>
  );
}

export default function Education() {
  const { education, languages } = useContent();
  return (
    <PageShell
      eyebrow="Education & Languages"
      title="Academic foundation and"
      highlight="how I communicate"
      intro="A Business Administration path rooted in accounting, plus the languages I use with teams, clients and stakeholders."
    >
      {/* ------------------------------ education ------------------------------ */}
      <div className="mt-14">
        <Reveal className="mb-8">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <School className="h-6 w-6 text-gblue" />
            Academic <span className="text-google">background</span>
          </h2>
        </Reveal>

        <Reveal className="grid gap-5 lg:grid-cols-3" stagger={0.13} y={60}>
          {education.map((e) => {
            const a = accents[e.color];
            return (
              <article
                key={e.degree}
                className={`glass lift group relative flex flex-col overflow-hidden rounded-[1.8rem] p-6 sm:p-7 ${a.glow} ${
                  e.current ? "ring-2 ring-gblue/25" : ""
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar} opacity-70`} />

                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-13 w-13 place-items-center rounded-2xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                    <e.icon className="h-6 w-6" />
                  </span>
                  {e.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ggreen/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ggreen ring-1 ring-ggreen/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-ggreen animate-pulse-dot" />
                      Running
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-display text-lg font-extrabold leading-snug tracking-tight text-ink">
                  {e.degree}
                </h3>
                <p className="mt-1.5 flex-1 text-[13.5px] font-semibold text-inksoft">{e.school}</p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-200/70 pt-4">
                  <span className="font-mono text-[11px] font-semibold text-gray-500">{e.period}</span>
                  {e.score && (
                    <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${a.chip}`}>{e.score}</span>
                  )}
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>

      {/* ------------------------------ languages ------------------------------ */}
      <div className="mt-20">
        <Reveal className="mb-8">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <LanguagesIcon className="h-6 w-6 text-gred" />
            <span className="text-google">Languages</span> I speak
          </h2>
        </Reveal>

        <Reveal className="grid gap-5 sm:grid-cols-3" stagger={0.13} y={56}>
          {languages.map((l) => {
            const a = accents[l.color];
            return (
              <article key={l.name} className={`glass lift flex items-center gap-5 rounded-[1.6rem] p-6 ${a.glow}`}>
                <Ring percent={l.percent} color={l.color} label={`${l.percent}%`} />
                <div>
                  <h3 className="font-display text-lg font-extrabold text-ink">{l.name}</h3>
                  <p className={`mt-1 text-[12.5px] font-semibold ${a.text}`}>{l.level}</p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </PageShell>
  );
}
