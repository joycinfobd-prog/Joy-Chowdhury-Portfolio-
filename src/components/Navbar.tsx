import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Send, X } from "lucide-react";
import { navLinks } from "../data/defaults";
import { useContent } from "../lib/content";

export default function Navbar() {
  const { profile } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close the drawer whenever the route changes */
  useEffect(() => setOpen(false), [pathname]);

  /* lock body scroll while the mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 print:hidden">
        <nav
          className={`glass-deep flex w-full max-w-5xl items-center justify-between gap-2 rounded-full py-2 pl-4 pr-2 transition-shadow duration-500 ${
            scrolled ? "shadow-[0_20px_55px_-22px_rgba(66,133,244,0.4)]" : ""
          }`}
        >
          {/* brand */}
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gblue via-gred to-gyellow font-display text-[13px] font-extrabold text-white shadow-lg shadow-gblue/30 transition-transform duration-500 group-hover:rotate-[18deg]">
              {profile.initials}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[13px] font-extrabold tracking-tight text-ink">
                {profile.name}
              </span>
            </span>
          </Link>

          {/* desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative block rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-300 ${
                      isActive ? "text-gblue" : "text-inksoft hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-gblue/10 ring-1 ring-gblue/25" />
                      )}
                      <span className="relative">{link.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="shine group hidden items-center gap-2 rounded-full bg-gblue px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-gblue/30 transition-all duration-300 hover:shadow-gblue/50 sm:flex"
            >
              <Send className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              Hire Me
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ---------------------- full screen mobile drawer ---------------------- */}
      <div
        className={`fixed inset-0 z-[60] print:hidden lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* scrim */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-white/70 backdrop-blur-2xl transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-x-4 top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-[2rem] p-5 sm:p-6 transition-all duration-500 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          } glass-deep`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-extrabold text-ink">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-100/80 text-ink transition-colors hover:bg-gray-200"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ul className="mt-5 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  style={{ transitionDelay: open ? `${i * 45 + 80}ms` : "0ms" }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-500 ${
                      open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    } ${isActive ? "bg-gblue/10 text-gblue ring-1 ring-gblue/25" : "text-ink hover:bg-gray-100/80"}`
                  }
                >
                  <span className="font-mono text-[11px] font-semibold text-gray-400">{link.index}</span>
                  <span className="font-display text-lg font-bold">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gblue px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-gblue/30"
          >
            <Send className="h-4 w-4" /> Hire Me
          </Link>
        </div>
      </div>
    </>
  );
}
