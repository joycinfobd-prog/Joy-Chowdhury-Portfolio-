import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "../data/defaults";
import { getIcon } from "./iconRegistry";

const STORAGE_KEY = "jc_site_content_v1";

/** Deep-merge stored overrides on top of defaults so new fields never break old saves. */
function merge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(patch) ? patch : base) as T;
  if (base && typeof base === "object" && patch && typeof patch === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = k in (base as Record<string, unknown>)
        ? merge((base as Record<string, unknown>)[k], v)
        : v;
    }
    return out as T;
  }
  return (patch === undefined ? base : (patch as T));
}

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return merge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

export function persistContent(next: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearContent() {
  localStorage.removeItem(STORAGE_KEY);
}

type Ctx = {
  content: SiteContent;
  setContent: (updater: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  save: () => void;
  reset: () => void;
  dirty: boolean;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => defaultContent);
  const [dirty, setDirty] = useState(false);

  // Hydrate from storage on mount (avoids SSR/first-paint mismatch).
  useEffect(() => {
    setContentState(loadContent());
  }, []);

  const setContent = useCallback((updater: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setContentState((prev) => (typeof updater === "function" ? (updater as (p: SiteContent) => SiteContent)(prev) : updater));
    setDirty(true);
  }, []);

  const save = useCallback(() => {
    setContentState((cur) => {
      persistContent(cur);
      return cur;
    });
    setDirty(false);
  }, []);

  const reset = useCallback(() => {
    clearContent();
    setContentState(defaultContent);
    setDirty(false);
  }, []);

  const value = useMemo(() => ({ content, setContent, save, reset, dirty }), [content, setContent, save, reset, dirty]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useCtx() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

/** Raw editable content + mutators (used by the admin console). */
export const useContentStore = useCtx;

/**
 * Render-ready content: same shape as the stored JSON, but every `iconName`
 * is additionally exposed as a resolved `icon` React component.
 */
export function useContent() {
  const { content } = useCtx();
  return useMemo(() => {
    const withIcon = <T extends { iconName?: string }>(arr: T[]) =>
      arr.map((it) => ({ ...it, icon: getIcon(it.iconName) }));

    return {
      ...content,
      highlights: withIcon(content.highlights),
      systemsBuilt: withIcon(content.systemsBuilt),
      experience: withIcon(content.experience),
      certifications: withIcon(content.certifications),
      additionalTrainings: withIcon(content.additionalTrainings),
      education: withIcon(content.education),
      portraitChips: withIcon(content.portraitChips),
      skillCategories: content.skillCategories.map((c) => ({ ...c, icon: getIcon(c.iconName) })),
    };
  }, [content]);
}
