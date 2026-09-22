import { Link } from "react-router-dom";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { navLinks } from "../data/defaults";
import { useContent } from "../lib/content";
import { socialIconMap } from "./icons";
import { scrollToTop } from "../lib/scroll";

export default function Footer() {
  const { profile, socials } = useContent();
  return (
    <footer className="relative px-5 pb-10 pt-10 sm:px-6 print:hidden">
      <div className="mx-auto max-w-6xl">
        <div className="glass overflow-hidden rounded-[2rem]">
          <div className="grid gap-8 p-6 sm:gap-10 sm:p-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* brand block */}
            <div>
              <Link to="/" className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gblue via-gred to-gyellow font-display text-sm font-extrabold text-white shadow-lg shadow-gblue/30">
                  {profile.initials}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-base font-extrabold text-ink">{profile.name}</span>
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-inksoft">
                Business Administration student blending corporate governance, accounting and Generative AI into
                practical business workflows.
              </p>
              <p className="mt-2 text-xs font-semibold italic text-gray-400">{profile.motto}</p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {socials.map((s) => {
                  const Icon = socialIconMap[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-gray-200/80 bg-white/70 text-inksoft transition-all duration-300 hover:-translate-y-1 hover:border-gblue/40 hover:text-gblue hover:shadow-lg hover:shadow-gblue/20"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* sitemap */}
            <div>
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-400">Pages</p>
              <ul className="mt-4 grid grid-cols-2 gap-y-2.5 lg:grid-cols-1">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-2 text-[13px] font-semibold text-inksoft transition-colors hover:text-gblue"
                    >
                      <span className="font-mono text-[10px] text-gray-300 transition-colors group-hover:text-gblue">
                        {link.index}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* contact */}
            <div>
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-gray-400">Reach out</p>
              <ul className="mt-4 flex flex-col gap-3.5">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-start gap-3 text-[13px] font-medium text-inksoft transition-colors hover:text-gblue"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gblue" />
                    <span className="break-all">{profile.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${profile.phone}`}
                    className="group flex items-start gap-3 text-[13px] font-medium text-inksoft transition-colors hover:text-ggreen"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ggreen" />
                    {profile.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[13px] font-medium text-inksoft">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gred" />
                  {profile.address}
                </li>
              </ul>
            </div>
          </div>

          {/* bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200/70 bg-white/40 px-6 py-5 text-center sm:flex-row sm:px-10 sm:text-left">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-gray-400 sm:block">
                Built with React · Tailwind · GSAP
              </span>
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group grid h-10 w-10 place-items-center rounded-full bg-gblue text-white shadow-lg shadow-gblue/30 transition-all duration-300 hover:-translate-y-1"
              >
                <ArrowUp className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
