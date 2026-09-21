import { BadgeCheck, Medal, ShieldCheck, Trophy } from "lucide-react";
import { useContent } from "../lib/content";
import { accents } from "../lib/accents";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

export default function Certifications() {
  const { certifications, additionalTrainings } = useContent();
  return (
    <PageShell
      eyebrow="Certifications & Honors"
      title="Certified skills and"
      highlight="national recognition"
      intro="Formal credentials that back up the work — a professional Generative AI certification and a national award for startup execution."
    >
      {/* ----------------------------- certificates ---------------------------- */}
      <Reveal className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.15} y={60}>
        {certifications.map((cert) => {
          const a = accents[cert.color];
          return (
            <article
              key={cert.name}
              className={`glass lift group relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-8 ${a.glow}`}
            >
              {/* ribbon glow */}
              <div aria-hidden className={`absolute -right-16 -top-16 h-48 w-48 rounded-full ${a.bgSoft} blur-3xl transition-transform duration-700 group-hover:scale-125`} />

              <div className="relative flex items-start justify-between gap-4">
                <span className={`grid h-16 w-16 place-items-center rounded-3xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <cert.icon className="h-8 w-8" />
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] ${a.chip}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {cert.badge}
                </span>
              </div>

              <h2 className="relative mt-7 font-display text-xl font-extrabold leading-snug tracking-tight text-ink">
                {cert.name}
              </h2>
              <p className={`relative mt-2 text-sm font-bold ${a.text}`}>{cert.issuer}</p>
              <p className="relative mt-4 flex-1 text-[13.5px] leading-relaxed text-inksoft">{cert.detail}</p>

              <div className="relative mt-6 flex flex-wrap items-center gap-2 border-t border-gray-200/70 pt-5">
                {cert.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-gray-100/80 px-2.5 py-1.5 font-mono text-[10.5px] font-medium text-gray-500">
                    {s}
                  </span>
                ))}
                <BadgeCheck className="ml-auto h-5 w-5 text-ggreen" />
              </div>
            </article>
          );
        })}
      </Reveal>

      {/* ------------------------------- summary ------------------------------- */}
      <Reveal className="mt-6 grid gap-5 sm:grid-cols-3" stagger={0.12} y={48}>
        <div className="glass lift flex items-center gap-4 rounded-[1.6rem] p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gyellow/15 text-gyellow ring-1 ring-gyellow/30">
            <Trophy className="h-5.5 w-5.5" />
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">1st</p>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-gray-500">Runner-up, GRIC</p>
          </div>
        </div>

        <div className="glass lift flex items-center gap-4 rounded-[1.6rem] p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gblue/12 text-gblue ring-1 ring-gblue/25">
            <Medal className="h-5.5 w-5.5" />
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">{certifications.length}</p>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-gray-500">Certifications</p>
          </div>
        </div>

        <div className="glass lift flex items-center gap-4 rounded-[1.6rem] p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ggreen/12 text-ggreen ring-1 ring-ggreen/25">
            <ShieldCheck className="h-5.5 w-5.5" />
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">National</p>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-gray-500">Level Recognition</p>
          </div>
        </div>
      </Reveal>

      {/* --------------------------- additional trainings --------------------------- */}
      <div className="mt-20">
        <Reveal className="mb-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Additional <span className="text-google">trainings & courses</span>
          </h2>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-inksoft">
            Extra hands-on training that rounds out the certifications above.
          </p>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-3" stagger={0.12} y={48}>
          {additionalTrainings.map((t) => {
            const a = accents[t.color];
            return (
              <div key={t.name} className={`glass lift flex items-center gap-4 rounded-[1.4rem] p-5 ${a.glow}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${a.iconWell}`}>
                  <t.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-[13.5px] font-bold text-ink">{t.name}</h3>
                  <p className="mt-0.5 truncate text-[12px] font-medium text-gray-500">{t.issuer}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </PageShell>
  );
}
