import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useContent } from "../lib/content";
import { PORTRAIT_BASE64 } from "../data/portraitBase64";

/**
 * ID-card style portrait: glass card with a clean photo area,
 * name bar, role line, and compact credential chips.
 * No floating "focus" pill — clean and minimal.
 */
export default function PortraitFrame() {
  const { profile } = useContent();
  const root = useRef<HTMLDivElement>(null);
  const photo = profile.photo || PORTRAIT_BASE64;

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-pf='card']", { y: -6, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[21rem] sm:max-w-[22rem]">
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-gblue/20 via-gred/10 to-ggreen/15 blur-3xl"
      />

      {/* ---- ID Card ---- */}
      <div data-pf="card" className="glass-deep relative overflow-hidden rounded-[1.8rem]">
        {/* top accent stripe */}
        <div className="h-1.5 bg-gradient-to-r from-gblue via-gred to-gyellow" />

        {/* photo area */}
        <div className="relative mx-auto mt-5 flex h-[16rem] w-[12.5rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 ring-4 ring-white/80 shadow-lg sm:mt-6 sm:h-[17rem] sm:w-[14rem]">
          <img
            src={photo}
            alt={profile.name}
            className="h-full w-full object-cover object-top"
            loading="eager"
          />
        </div>

        {/* name & role */}
        <div className="px-5 pb-2 pt-4 text-center sm:px-6 sm:pt-5">
          <h2 className="font-display text-[1.35rem] font-extrabold tracking-tight text-ink sm:text-2xl">
            {profile.name}
          </h2>
          <p className="mt-1 text-[12px] font-semibold leading-snug text-inksoft sm:text-[13px]">
            {profile.roleLineA} · <span className="text-google">{profile.roleLineB}</span>
          </p>
        </div>

        {/* credential chips */}
        <div className="flex flex-wrap justify-center gap-1.5 px-4 pb-5 pt-1 sm:gap-2 sm:px-6 sm:pb-6 sm:pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gblue/10 px-2.5 py-1.5 text-[10.5px] font-bold text-gblue ring-1 ring-gblue/20 sm:px-3 sm:text-[11px]">
            ✦ AI Prompt Engineering
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gyellow/10 px-2.5 py-1.5 text-[10.5px] font-bold text-gyellow ring-1 ring-gyellow/25 sm:px-3 sm:text-[11px]">
            ✦ Financial Accounting
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gred/10 px-2.5 py-1.5 text-[10.5px] font-bold text-gred ring-1 ring-gred/20 sm:px-3 sm:text-[11px]">
            ✦ Digital Marketing
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ggreen/10 px-2.5 py-1.5 text-[10.5px] font-bold text-ggreen ring-1 ring-ggreen/20 sm:px-3 sm:text-[11px]">
            ✦ Corporate Governance
          </span>
        </div>

        {/* bottom info bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-gray-200/70 bg-gray-50/60 px-4 py-3 sm:justify-between sm:px-6">
          <span className="text-[10.5px] font-medium text-gray-500 sm:text-[11px]">{profile.locationShort}</span>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-ggreen sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-ggreen animate-pulse-dot" />
            {profile.availability}
          </span>
        </div>
      </div>
    </div>
  );
}
