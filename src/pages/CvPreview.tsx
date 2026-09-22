import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { useContent } from "../lib/content";
import { printResume, resumeDataUri, RESUME_FILE_NAME } from "../lib/resume";
import { buildCvPlainText } from "../lib/cvText";

function stripUrl(href: string): string {
  return href
    .replace(/^mailto:/i, "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-gblue print:text-[#4285F4]">
        {title}
      </h2>
      <div aria-hidden className="mt-1.5 h-[2px] w-full rounded-full bg-gblue/70 print:bg-[#4285F4]" />
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-slate-800">
          <span aria-hidden className="font-bold text-gblue print:text-[#4285F4]">
            •
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * ATS CV preview — Download CV lands here first. The visitor reads the
 * exact ATS-readable text, then presses Save as PDF to download the file,
 * or goes back to the portfolio.
 */
export default function CvPreview() {
  const content = useContent();
  const {
    profile,
    socials,
    experience,
    systemsBuilt,
    skillCategories,
    softwareTools,
    softSkills,
    certifications,
    additionalTrainings,
    education,
    languages,
  } = content;

  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // A plain <a download> pointing at the embedded PDF data URI — pure HTML,
  // no script involved, so nothing can block or swallow the click.

  const addressLine = profile.address.includes("Bangladesh")
    ? profile.address
    : `${profile.address}, Bangladesh`;
  const whatsapp = socials.find((s) => s.label.toLowerCase() === "whatsapp");
  const linkSocials = socials.filter(
    (s) => s.icon !== "mail" && s.href && !s.href.toLowerCase().startsWith("mailto:")
  );
  const summary = profile.motto ? `${profile.profileText} ${profile.motto}` : profile.profileText;

  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  const onSavedClick = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  const handleCopy = async () => {
    const text = buildCvPlainText(content);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-10 pt-28 sm:pt-32 print:pb-0 print:pt-0">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {/* breadcrumb — screen only */}
        <div className="no-print flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 print:hidden">
          <Link to="/" className="transition-colors hover:text-gblue">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gblue">CV Preview</span>
        </div>

        {/* header — screen only */}
        <div className="no-print mt-6 print:hidden">
          <span className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-inksoft">
            <FileText className="h-3.5 w-3.5 text-gblue" />
            ATS-Friendly CV
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl sm:leading-[1.05]">
            Review first, <span className="text-google">download when ready</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-inksoft">
            This is the exact ATS-readable version of the CV — single column, standard headings,
            plain selectable text. Read it below, then press{" "}
            <strong className="font-bold text-ink">Download CV</strong> to save the file.
          </p>
        </div>

        {/* trust strip — screen only */}
        <div className="no-print mt-6 grid gap-3 sm:grid-cols-3 print:hidden">
          {[
            { icon: ShieldCheck, color: "text-gblue", title: "ATS-safe layout", sub: "Parses cleanly in every tracker" },
            { icon: FileText, color: "text-ggreen", title: "Plain text", sub: "Fully selectable, no images" },
            { icon: Check, color: "text-gred", title: "Same branding", sub: "Matches the portfolio + PDF" },
          ].map((f) => (
            <div key={f.title} className="glass flex items-center gap-3 rounded-2xl p-4">
              <f.icon className={`h-5 w-5 shrink-0 ${f.color}`} />
              <div>
                <p className="text-[13px] font-bold text-ink">{f.title}</p>
                <p className="text-[11.5px] text-gray-500">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* action bar — screen only */}
        <div className="no-print sticky top-[76px] z-30 mt-6 print:hidden">
          <div className="glass-deep flex flex-wrap items-center gap-2.5 rounded-2xl p-3">
            <button
              type="button"
              onClick={goBack}
              className="glass group flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40"
            >
              <ArrowLeft className="h-4 w-4 text-gblue transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to Portfolio
            </button>
            <div className="ml-auto flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-4 py-2.5 text-[13px] font-bold text-inksoft transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40 hover:text-gblue"
              >
                {copied ? <Check className="h-4 w-4 text-ggreen" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                type="button"
                onClick={printResume}
                className="hidden items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-4 py-2.5 text-[13px] font-bold text-inksoft transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40 hover:text-gblue sm:flex"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <a
                href={resumeDataUri}
                download={RESUME_FILE_NAME}
                onClick={onSavedClick}
                className="shine group flex cursor-pointer items-center gap-2 rounded-full bg-gblue px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-gblue/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gblue/40"
              >
                {saved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />}
                {saved ? "Downloading…" : "Download CV"}
              </a>
            </div>
          </div>

        </div>

        {/* ==================== ATS PAPER (prints clean) ==================== */}
        <article
          id="cv-paper"
          className="mt-6 rounded-[1.5rem] border border-gray-200/70 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-10 print:mt-0"
        >
          {/* header */}
          <header>
            <p className="font-display text-3xl font-extrabold uppercase tracking-tight text-gblue sm:text-4xl print:text-[#4285F4]">
              {profile.name}
            </p>
            <p className="mt-1.5 text-[14px] font-bold text-ink">
              {profile.roleLineA}
              <span className="mx-2 font-normal text-gray-300">|</span>
              {profile.roleLineB}
            </p>
            <div className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-gray-600">
              <p>{addressLine}</p>
              <p>
                <span className="font-semibold text-ink">Phone:</span> {profile.phone}
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-semibold text-ink">Email:</span> {profile.email}
                {whatsapp && (
                  <>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="font-semibold text-ink">WhatsApp:</span> {whatsapp.handle}
                  </>
                )}
              </p>
              {linkSocials.length > 0 && (
                <p className="break-words">
                  {linkSocials.map((s, i) => (
                    <span key={s.label}>
                      {i > 0 && <span className="mx-2 text-gray-300">|</span>}
                      <span className="font-semibold text-ink">{s.label}:</span> {stripUrl(s.href)}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <div aria-hidden className="mt-4 h-[3px] w-full rounded-full bg-gblue print:bg-[#4285F4]" />
          </header>

          {/* summary */}
          <CvSection title="Professional Summary">
            <p className="text-[13px] leading-[1.75] text-slate-800">{summary}</p>
          </CvSection>

          {/* experience */}
          <CvSection title="Work Experience">
            <div className="space-y-6">
              {experience.map((job) => (
                <div key={job.role} className="cv-avoid-break">
                  <h3 className="text-[14px] font-extrabold leading-snug text-ink">{job.role}</h3>
                  <p className="mt-0.5 text-[12.5px]">
                    <span className="font-bold text-gblue print:text-[#4285F4]">{job.company}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500">{job.period}</span>
                  </p>
                  <Bullets items={job.points} />
                  {job.tags.length > 0 && (
                    <p className="mt-2 text-[11.5px] leading-relaxed text-gray-500">
                      {job.tags.join("  ·  ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CvSection>

          {/* selected work */}
          {systemsBuilt.length > 0 && (
            <CvSection title="Selected Work">
              <div className="space-y-5">
                {systemsBuilt.map((s) => (
                  <div key={s.title} className="cv-avoid-break">
                    <h3 className="text-[14px] font-extrabold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-800">{s.detail}</p>
                    {s.tags.length > 0 && (
                      <p className="mt-1.5 text-[11.5px] text-gray-500">{s.tags.join("  ·  ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </CvSection>
          )}

          {/* skills */}
          <CvSection title="Skills">
            <div className="space-y-2.5 text-[13px] leading-relaxed text-slate-800">
              {skillCategories.map((cat) => (
                <p key={cat.title} className="cv-avoid-break">
                  <strong className="font-bold text-ink">{cat.title}: </strong>
                  {[...cat.skills.map((s) => s.name), ...(cat.extraTools ?? [])].join(", ")}
                </p>
              ))}
              {softwareTools.length > 0 && (
                <p>
                  <strong className="font-bold text-ink">Software &amp; Tools: </strong>
                  {softwareTools.join(", ")}
                </p>
              )}
              {softSkills.length > 0 && (
                <p>
                  <strong className="font-bold text-ink">Soft Skills &amp; Leadership: </strong>
                  {softSkills.join(", ")}
                </p>
              )}
            </div>
          </CvSection>

          {/* certifications */}
          <CvSection title="Certifications & Honors">
            <div className="space-y-5">
              {certifications.map((cert) => (
                <div key={cert.name} className="cv-avoid-break">
                  <h3 className="text-[14px] font-extrabold leading-snug text-ink">{cert.name}</h3>
                  <p className="mt-0.5 text-[12.5px]">
                    <span className="font-bold text-gblue print:text-[#4285F4]">{cert.issuer}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500">{cert.badge}</span>
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-800">{cert.detail}</p>
                  {cert.skills.length > 0 && (
                    <p className="mt-1.5 text-[11.5px] text-gray-500">
                      Skills: {cert.skills.join(", ")}
                    </p>
                  )}
                </div>
              ))}
              {additionalTrainings.map((t) => (
                <div key={t.name} className="cv-avoid-break">
                  <h3 className="text-[14px] font-extrabold text-ink">{t.name}</h3>
                  <p className="mt-0.5 text-[12.5px]">
                    <span className="font-bold text-gblue print:text-[#4285F4]">{t.issuer}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500">Additional Training</span>
                  </p>
                </div>
              ))}
            </div>
          </CvSection>

          {/* education */}
          <CvSection title="Education">
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.degree} className="cv-avoid-break">
                  <h3 className="text-[14px] font-extrabold text-ink">{e.degree}</h3>
                  <p className="mt-0.5 text-[12.5px]">
                    <span className="font-bold text-gblue print:text-[#4285F4]">{e.school}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500">{e.period}</span>
                    {e.score && (
                      <>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-gray-500">{e.score}</span>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CvSection>

          {/* languages */}
          <CvSection title="Languages">
            <p className="text-[13px] leading-relaxed text-slate-800">
              {languages.map((l) => `${l.name} — ${l.level}`).join("  |  ")}
            </p>
          </CvSection>
        </article>

        {/* bottom bar — screen only */}
        <div className="no-print mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center print:hidden">
          <button
            type="button"
            onClick={goBack}
            className="glass group flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gblue/40"
          >
            <ArrowLeft className="h-4 w-4 text-gblue transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to Portfolio
          </button>
          <a
            href={resumeDataUri}
            download={RESUME_FILE_NAME}
            onClick={onSavedClick}
            className="shine group flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gblue px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-gblue/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-gblue/50"
          >
            {saved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />}
            {saved ? "Downloading…" : "Download CV"}
          </a>
        </div>
        <p className="no-print mt-4 text-center text-xs text-gray-400 print:hidden">
          Press <strong className="font-semibold text-inksoft">Download CV</strong> and the file{" "}
          <strong className="font-semibold text-inksoft">{RESUME_FILE_NAME}</strong> saves
          straight away — same content and Google-blue branding as this preview.
          <br />
          If your browser opens it instead of saving, tap{" "}
          <strong className="font-semibold text-inksoft">Print</strong> and pick{" "}
          <strong className="font-semibold text-inksoft">Save as PDF</strong>.
        </p>
      </div>
    </div>
  );
}
