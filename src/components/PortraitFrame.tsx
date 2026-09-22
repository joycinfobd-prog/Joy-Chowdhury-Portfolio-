import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useContent } from "../lib/content";
import { PORTRAIT_BASE64 } from "../data/portraitBase64";

/**
 * ID-card style portrait.
 *
 * Photo priority:
 *  1. Admin custom photo (uploaded/pasted in console, differs from default)
 *  2. External `joy-portrait.jpg` sitting next to index.html on the server
 *     (so replacing the file on GitHub + redeploy updates the site
 *     without touching code) — checked fresh on every visit.
 *  3. Embedded fallback portrait (works even as a single offline file).
 */
const EXTERNAL_CANDIDATES = ["joy-portrait.jpg", "./joy-portrait.jpg", "public/joy-portrait.jpg"];

export default function PortraitFrame() {
  const { profile } = useContent();
  const root = useRef<HTMLDivElement>(null);

  const stored = profile.photo || "";
  const isCustom = stored.length > 0 && stored !== PORTRAIT_BASE64;

  const [external, setExternal] = useState<string | null>(null);

  // Probe for an external photo file (only when no custom admin photo).
  useEffect(() => {
    if (isCustom) return;
    let cancelled = false;
    // Cache-buster so a newly uploaded photo shows immediately.
    const stamp = Date.now();
    const tryNext = (i: number) => {
      if (cancelled || i >= EXTERNAL_CANDIDATES.length) return;
      const img = new Image();
      const url = `${EXTERNAL_CANDIDATES[i]}?v=${stamp}`;
      img.onload = () => {
        if (!cancelled) setExternal(url);
      };
      img.onerror = () => tryNext(i + 1);
      img.src = url;
    };
    tryNext(0);
    return () => {
      cancelled = true;
    };
  }, [isCustom]);

  const photo = isCustom ? stored : external || PORTRAIT_BASE64;

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-pf='card']", { y: -6, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[22rem]">
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-gblue/20 via-gred/10 to-ggreen/15 blur-3xl"
      />

      {/* ---- ID Card (no dark drop shadow) ---- */}
      <div
        data-pf="card"
        className="relative overflow-hidden rounded-[1.8rem] border border-white/90 bg-white/80 shadow-none backdrop-blur-2xl"
        style={{ boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.95)" }}
      >
        {/* top accent stripe */}
        <div className="h-1.5 bg-gradient-to-r from-gblue via-gred to-gyellow" />

        {/* photo area */}
        <div className="relative mx-auto mt-6 flex h-[17rem] w-[14rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-none ring-4 ring-white/80">
          <img
            key={photo.slice(0, 32)}
            src={photo}
            alt={profile.name}
            className="h-full w-full object-cover object-top"
            loading="eager"
            // If the external file 404s after all, fall back to embedded.
            onError={(e) => {
              if (photo !== PORTRAIT_BASE64) {
                e.currentTarget.src = PORTRAIT_BASE64;
                setExternal(null);
              }
            }}
          />
        </div>

        {/* name & role */}
        <div className="px-6 pt-5 pb-2 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {profile.name}
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-inksoft">
            {profile.roleLineA} · <span className="text-google">{profile.roleLineB}</span>
          </p>
        </div>

        {/* credential chips */}
        <div className="flex flex-wrap justify-center gap-2 px-6 pb-6 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gblue/10 px-3 py-1.5 text-[11px] font-bold text-gblue ring-1 ring-gblue/20">
            ✦ AI Prompt Engineering
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gyellow/10 px-3 py-1.5 text-[11px] font-bold text-gyellow ring-1 ring-gyellow/25">
            ✦ Financial Accounting
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gred/10 px-3 py-1.5 text-[11px] font-bold text-gred ring-1 ring-gred/20">
            ✦ Digital Marketing
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ggreen/10 px-3 py-1.5 text-[11px] font-bold text-ggreen ring-1 ring-ggreen/20">
            ✦ Corporate Governance
          </span>
        </div>

        {/* bottom info bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-gray-200/70 bg-gray-50/60 px-5 py-3 text-center sm:justify-between sm:px-6 sm:text-left">
          <span className="text-[11px] font-medium text-gray-500">{profile.locationShort}</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ggreen">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ggreen animate-pulse-dot" />
            {profile.availability}
          </span>
        </div>
      </div>
    </div>
  );
}
