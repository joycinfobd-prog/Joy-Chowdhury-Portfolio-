import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useContent } from "../lib/content";
import { sendContact } from "../lib/mailer";
import { socialIconMap } from "../components/icons";
import PageShell from "../components/PageShell";
import Reveal from "../components/Reveal";

type Status = { kind: "idle" | "sending" | "sent" | "error"; note?: string };

export default function Contact() {
  const { profile, socials, settings } = useContent();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const infoRows = [
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, well: "bg-ggreen/12 text-ggreen" },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, well: "bg-gblue/12 text-gblue" },
    { icon: MapPin, label: "Address", value: profile.address, href: undefined, well: "bg-gred/12 text-gred" },
  ];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — bots fill hidden fields, humans never see them.
    if (String(fd.get("company") || "")) return;

    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    };

    setStatus({ kind: "sending" });
    const res = await sendContact(payload, {
      accessKey: settings.web3formsKey,
      toEmail: profile.email,
      toName: profile.name,
    });

    if (res.ok) {
      setStatus({ kind: "sent" });
      form.reset();
      setTimeout(() => setStatus({ kind: "idle" }), 8000);
      return;
    }

    setStatus({ kind: "error", note: res.error });
  };

  const sending = status.kind === "sending";

  return (
    <PageShell
      eyebrow="Contact"
      title="Let's start a"
      highlight="conversation"
      intro="Have a role, a project, or a business problem worth solving? Reach out directly — I reply to every genuine message."
    >
      <Reveal className="glass-deep mt-14 overflow-hidden rounded-[2.2rem]" y={60}>
        <div className="grid lg:grid-cols-[1fr_1.08fr]">
          {/* ------------------------- info panel ------------------------- */}
          <div className="relative flex flex-col gap-6 p-6 sm:flex-col sm:gap-8 sm:p-10">
            <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gblue/15 blur-3xl" />
            <div aria-hidden className="absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-ggreen/15 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-ggreen/10 px-3.5 py-1.5 text-xs font-bold text-ggreen ring-1 ring-ggreen/25">
                <span className="h-2 w-2 rounded-full bg-ggreen animate-pulse-dot" />
                {profile.availability}
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Get in <span className="text-google">touch</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-inksoft">{settings.contactNote}</p>
            </div>

            <div className="relative flex flex-col gap-2.5">
              {infoRows.map((row) => {
                const Tag = (row.href ? "a" : "div") as "a";
                return (
                  <Tag
                    key={row.label}
                    {...(row.href ? { href: row.href } : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-gray-200/80 hover:bg-white/60"
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${row.well}`}>
                      <row.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">
                        {row.label}
                      </span>
                      <span className="block break-words text-[13.5px] font-bold text-ink">{row.value}</span>
                    </span>
                    {row.href && (
                      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gblue" />
                    )}
                  </Tag>
                );
              })}
            </div>

            <div className="relative mt-auto">
              <p className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-400">Connect</p>
              <div className="flex flex-wrap gap-2.5">
                {socials.map((s) => {
                  const Icon = socialIconMap[s.icon] ?? socialIconMap.mail;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      title={`${s.label} — ${s.handle}`}
                      aria-label={s.label}
                      className="group grid h-11 w-11 place-items-center rounded-full border border-gray-200/80 bg-white/70 text-inksoft transition-all duration-300 hover:-translate-y-1 hover:border-gblue/40 hover:bg-gblue/5 hover:text-gblue hover:shadow-lg hover:shadow-gblue/20"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --------------------------- form --------------------------- */}
          <form
            onSubmit={onSubmit}
            className="relative border-t border-gray-200/70 bg-white/45 p-6 sm:p-10 lg:border-l lg:border-t-0"
          >
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Your name</span>
                  <input required name="name" type="text" placeholder="Enter your name" className="field" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Email</span>
                  <input required name="email" type="email" placeholder="you@example.com" className="field" />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Subject</span>
                <input name="subject" type="text" placeholder="What is this about?" className="field" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Message</span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  placeholder="Tell me about your project, role or idea…"
                  className="field resize-none"
                />
              </label>

              {/* honeypot (hidden from humans) */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <button
                type="submit"
                disabled={sending}
                className="shine group mt-1 flex w-fit items-center gap-2.5 rounded-full bg-gblue px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-gblue/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-gblue/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Message"}
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                )}
              </button>

              {status.kind === "sent" && (
                <p className="flex items-start gap-2 rounded-2xl bg-ggreen/10 px-4 py-3 text-[13px] font-semibold text-ggreen ring-1 ring-ggreen/25">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  Message sent — it has landed in {profile.name.split(" ")[0]}'s inbox. Thank you!
                </p>
              )}
              {status.kind === "error" && (
                <p className="flex items-start gap-2 rounded-2xl bg-gred/10 px-4 py-3 text-[13px] font-semibold text-gred ring-1 ring-gred/25">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Couldn't send right now{status.note ? ` (${status.note})` : ""}. Please email{" "}
                  {profile.email} directly.
                </p>
              )}

              <p className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Based in {profile.locationShort} · GMT+6
              </p>
            </div>
          </form>
        </div>
      </Reveal>
    </PageShell>
  );
}
