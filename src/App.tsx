import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initSmoothScroll, jumpToTop } from "./lib/scroll";
import { ContentProvider } from "./lib/content";
import Background from "./components/Background";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Certifications from "./pages/Certifications";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

gsap.registerPlugin(ScrollTrigger);

/** Unlisted console path — never rendered as a link anywhere on the site. */
export const ADMIN_PATH = "/console-x7k2";

/* --------------------------------------------------------------------------
   Page transition: resets scroll, replays an entrance animation and refreshes
   ScrollTrigger so every new page's reveals measure correctly.
-------------------------------------------------------------------------- */
function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const wrap = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const lastPath = useRef(pathname);

  if (lastPath.current !== pathname) {
    lastPath.current = pathname;
    jumpToTop();
  }

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sweep.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(sweep.current, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.45,
              ease: "power2.inOut",
            });
          },
        }
      );

      gsap.fromTo(
        wrap.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", onComplete: () => ScrollTrigger.refresh() }
      );
    });

    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={sweep}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-[linear-gradient(90deg,#4285F4,#EA4335,#FBBC05,#34A853)]"
        style={{ transform: "scaleX(0)" }}
      />
      <div ref={wrap}>{children}</div>
    </>
  );
}

/** Ctrl/Cmd + Shift + K → jump to the console (no visible entry point). */
function useSecretShortcut() {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate(ADMIN_PATH);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}

function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname === ADMIN_PATH;
  useSecretShortcut();

  useEffect(() => {
    const destroy = initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      destroy();
    };
  }, []);

  if (isAdmin) {
    return (
      <div className="relative min-h-screen">
        <Background />
        <Admin />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="noise-layer" aria-hidden />
      <Cursor />
      <Navbar />

      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </ContentProvider>
  );
}
