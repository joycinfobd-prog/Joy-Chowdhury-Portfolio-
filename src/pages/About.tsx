import { Link } from "react-router-dom";
import { ArrowRight, Bot, Building2, Calculator, Mail, MapPin, Phone, Quote, Target } from "lucide-react";
import { useContent } from "../lib/content";
import { accents } from "../lib/accents";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

const focusAreas = [
  {
    icon: Building2,
    color: "gblue" as const,
    title: "Corporate Governance",
    text: "Board-level decision-making, organizational growth strategy and structured business operations.",
  },
  {
    icon: Calculator,
    color: "gyellow" as const,
    title: "Financial Accounting",
    text: "Double-entry systems, Chart of Accounts, ledgers, asset registers and real-time dashboards.",
  },
  {
    icon: Bot,
    color: "gred" as const,
    title: "Generative AI",
    text: "Prompt frameworks, LLM output evaluation and quality control integrated into daily workflows.",
  },
  {
    icon: Target,
    color: "ggreen" as const,
    title: "Strategy & Execution",
    text: "Project strategy, pitching and execution — proven at the GRIC national startup round.",
  },
];

export default function About() {
  const { profile, highlights, systemsBuilt } = useContent();
  return (
    <PageShell
      eyebrow="About Me"
      title="The profile behind"
      highlight="the work"
      intro="A Business Administration student and certified AI Prompt Specialist, bringing corporate governance, accounting discipline and Generative AI together in one workflow."
    >
      {/* ------------------------------ profile ------------------------------ */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Reveal className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-10" y={56}>
          <Quote aria-hidden className="absolute -right-6 -top-6 h-40 w-40 rotate-12 text-gblue/8" strokeWidth={1} />
          <div className="relative">
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Professional Profile
            </span>
            <p className="mt-5 text-[15px] leading-[1.9] text-inksoft">{profile.profileText}</p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Corporate Governance", "Financial Accounting", "Generative AI", "LLM Optimization"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gray-200/70 bg-white/70 px-3.5 py-2 text-xs font-semibold text-ink"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-gray-200/70 pt-6">
              <div>
                <p className="font-display text-lg font-extrabold text-ink">{profile.name}</p>
              </div>
              <span className="shrink-0 font-display text-4xl font-extrabold text-google opacity-90 sm:text-5xl">{profile.initials}</span>
            </div>
          </div>
        </Reveal>

        {/* quick facts card */}
        <Reveal className="flex flex-col gap-5" stagger={0.14} y={56}>
          <div className="glass rounded-[1.8rem] p-6 sm:p-7">
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Quick Facts
            </span>
            <ul className="mt-5 flex flex-col gap-4">
              <li className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gblue/12 text-gblue">
                  <Building2 className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Role</span>
                  <span className="block text-[13.5px] font-bold text-ink">Board Director, Shikkha IT Ltd</span>
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gred/12 text-gred">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Based in</span>
                  <span className="block text-[13.5px] font-bold text-ink">{profile.address}</span>
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ggreen/12 text-ggreen">
                  <Phone className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Phone</span>
                  <a href={`tel:${profile.phone}`} className="block text-[13.5px] font-bold text-ink hover:text-ggreen">
                    {profile.phone}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gyellow/15 text-gyellow">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Email</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="block break-all text-[13.5px] font-bold text-ink hover:text-gblue"
                  >
                    {profile.email}
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <Link
            to="/contact"
            className="glass lift group flex items-center justify-between gap-4 rounded-[1.8rem] p-7 hover:border-gblue/40"
          >
            <span>
              <span className="block font-display text-lg font-extrabold text-ink">Let's work together</span>
              <span className="mt-1 block text-[13px] text-inksoft">Open to roles & collaborations</span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gblue text-white shadow-lg shadow-gblue/30 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </Reveal>
      </div>

      {/* ---------------------------- focus areas ---------------------------- */}
      <div className="mt-20">
        <Reveal className="mb-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Core <span className="text-google">focus areas</span>
          </h2>
        </Reveal>

        <Reveal className="grid gap-5 sm:grid-cols-2" stagger={0.12} y={56}>
          {focusAreas.map((f) => {
            const a = accents[f.color];
            return (
              <article key={f.title} className={`glass lift group flex items-start gap-5 rounded-[1.6rem] p-6 sm:p-7 ${a.glow}`}>
                <span className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <f.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-inksoft">{f.text}</p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>

      {/* ---------------------------- achievements --------------------------- */}
      <div className="mt-20">
        <Reveal className="mb-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Key <span className="text-google">achievements</span>
          </h2>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-2" stagger={0.11} y={48}>
          {highlights.map((h) => {
            const a = accents[h.color];
            return (
              <div key={h.title} className="glass lift flex items-start gap-4 rounded-[1.4rem] p-5">
                <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
                <div>
                  <h3 className="font-display text-[14.5px] font-bold text-ink">{h.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-inksoft">{h.detail}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>

      {/* ------------------------------ systems built ----------------------------- */}
      <div className="mt-20">
        <Reveal className="mb-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Systems I've built that actually <span className="text-google">move the needle</span>
          </h2>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-inksoft">
            Beyond frameworks and theory — real, live systems built with AI engineering.
          </p>
        </Reveal>

        <Reveal stagger={0.12} y={56}>
          {systemsBuilt.map((s) => {
            const a = accents[s.color];
            return (
              <article key={s.title} className={`glass lift group relative overflow-hidden rounded-[1.8rem] p-7 sm:p-8 ${a.glow}`}>
                <div aria-hidden className={`absolute -right-14 -top-14 h-48 w-48 rounded-full ${a.bgSoft} blur-3xl transition-transform duration-700 group-hover:scale-125`} />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${a.iconWell} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                    <s.icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">{s.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-inksoft">{s.detail}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span key={t} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${a.chip}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </PageShell>
  );
}
