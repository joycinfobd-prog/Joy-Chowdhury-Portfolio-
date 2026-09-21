import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Download,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { attemptsLeft, isAuthed, lockRemainingMs, login, logout, SESSION_MINUTES, touchSession } from "../lib/auth";
import { useContentStore } from "../lib/content";
import { defaultContent, type SiteContent } from "../data/defaults";
import { ICON_NAMES } from "../lib/iconRegistry";

const ACCENTS = ["gblue", "gred", "gyellow", "ggreen"] as const;

/* ========================================================================== */
/*  Login gate                                                                */
/* ========================================================================== */
function LoginGate({ onPass }: { onPass: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [wait, setWait] = useState(lockRemainingMs());

  useEffect(() => {
    if (wait <= 0) return;
    const t = setInterval(() => setWait(lockRemainingMs()), 500);
    return () => clearInterval(t);
  }, [wait]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await login(pw);
    setBusy(false);
    setPw("");
    if (res.ok) return onPass();
    if (res.reason === "locked") {
      setWait(res.waitMs ?? 0);
      setMsg("Too many attempts. Temporarily locked.");
    } else {
      const left = attemptsLeft();
      setWait(lockRemainingMs());
      setMsg(left > 0 ? `Incorrect password. ${left} attempt${left === 1 ? "" : "s"} left.` : "Locked out.");
    }
  };

  const locked = wait > 0;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <form onSubmit={submit} className="glass-deep w-full max-w-sm rounded-[2rem] p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center font-display text-xl font-extrabold tracking-tight text-ink">
          Restricted Console
        </h1>
        <p className="mt-1.5 text-center text-[12.5px] text-inksoft">Authorised access only.</p>

        <label className="mt-7 block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Password</span>
          <input
            type="password"
            value={pw}
            autoFocus
            autoComplete="current-password"
            disabled={locked || busy}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••••"
            className="field mt-2"
          />
        </label>

        {msg && (
          <p className="mt-3 rounded-xl bg-gred/8 px-3 py-2 text-center text-[12px] font-semibold text-gred ring-1 ring-gred/20">
            {msg}
            {locked && ` Retry in ${Math.ceil(wait / 1000)}s.`}
          </p>
        )}

        <button
          type="submit"
          disabled={locked || busy || !pw}
          className="shine mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gblue py-3.5 text-sm font-bold text-white shadow-lg shadow-gblue/30 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {busy ? "Verifying…" : "Unlock"}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-gray-400">
          <ShieldCheck className="h-3 w-3" /> Session expires after {SESSION_MINUTES} min
        </p>
      </form>
    </div>
  );
}

/* ========================================================================== */
/*  Small field primitives                                                    */
/* ========================================================================== */
function Field({ label, value, onChange, area = false, type = "text" }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  area?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gray-500">{label}</span>
      {area ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1.5 resize-y" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1.5" />
      )}
    </label>
  );
}

function Select({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gray-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1.5">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Editable list of plain strings. */
function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <span className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gray-500">{label}</span>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className="field"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gred/10 text-gred transition hover:bg-gred/20"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2.5 text-[12px] font-bold text-inksoft transition hover:border-gblue hover:text-gblue"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
    </div>
  );
}

/** Collapsible card wrapper for one record inside a list. */
function Card({ title, onDelete, children }: { title: string; onDelete: () => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl">
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left text-[13px] font-bold text-ink"
        >
          <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          <span className="truncate">{title || "Untitled"}</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gred/10 text-gred transition hover:bg-gred/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && <div className="flex flex-col gap-3 border-t border-gray-200/70 p-4">{children}</div>}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-300 py-3 text-[12.5px] font-bold text-inksoft transition hover:border-gblue hover:text-gblue"
    >
      <Plus className="h-4 w-4" /> Add new
    </button>
  );
}

/* ========================================================================== */
/*  Console                                                                   */
/* ========================================================================== */
const SECTIONS = [
  "Profile",
  "Photo",
  "Email",
  "Socials",
  "Stats",
  "Chips",
  "Highlights",
  "Systems",
  "Experience",
  "Skills",
  "Tools",
  "Certifications",
  "Education",
  "Languages",
  "Backup",
] as const;

function Console({ onExit }: { onExit: () => void }) {
  const { content, setContent, save, reset, dirty } = useContentStore();
  const [tab, setTab] = useState<(typeof SECTIONS)[number]>("Profile");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);

  // Keep the session alive while actively editing.
  useEffect(() => {
    const h = () => touchSession();
    window.addEventListener("keydown", h);
    window.addEventListener("click", h);
    return () => {
      window.removeEventListener("keydown", h);
      window.removeEventListener("click", h);
    };
  }, []);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  };

  const patch = <K extends keyof SiteContent>(key: K, val: SiteContent[K]) =>
    setContent((p) => ({ ...p, [key]: val }));

  const patchProfile = (k: keyof SiteContent["profile"], v: string) =>
    setContent((p) => ({ ...p, profile: { ...p.profile, [k]: v } }));

  const onPhoto = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 2.5 * 1024 * 1024) return flash("Image too large (max 2.5 MB)");
    const r = new FileReader();
    r.onload = () => {
      patchProfile("photo", String(r.result));
      flash("Photo loaded — remember to Save");
    };
    r.readAsDataURL(f);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        setContent(JSON.parse(String(r.result)) as SiteContent);
        flash("Imported — press Save to apply");
      } catch {
        flash("Invalid JSON file");
      }
    };
    r.readAsText(f);
  };

  const photoKb = useMemo(
    () => (content.profile.photo ? Math.round((content.profile.photo.length * 0.75) / 1024) : 0),
    [content.profile.photo]
  );

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="glass-deep flex flex-wrap items-center gap-3 rounded-[1.5rem] p-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="mr-auto">
            <h1 className="font-display text-base font-extrabold text-ink">Content Console</h1>
            <p className="text-[11.5px] text-gray-500">
              {dirty ? "Unsaved changes" : "All changes saved"} · auto-logout {SESSION_MINUTES} min
            </p>
          </div>
          <button
            onClick={() => {
              save();
              flash("Saved — site updated");
            }}
            className="flex items-center gap-2 rounded-xl bg-gblue px-4 py-2.5 text-[12.5px] font-bold text-white shadow-lg shadow-gblue/25 transition hover:-translate-y-0.5"
          >
            <Save className="h-4 w-4" /> Save
          </button>
          <button
            onClick={() => {
              logout();
              onExit();
            }}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-[12.5px] font-bold text-inksoft transition hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4" /> Exit
          </button>
        </div>

        {/* tabs */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                tab === s ? "bg-gblue text-white shadow-md shadow-gblue/25" : "glass text-inksoft hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* panel */}
        <div className="glass mt-4 rounded-[1.5rem] p-5 sm:p-6">
          {tab === "Profile" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={content.profile.name} onChange={(v) => patchProfile("name", v)} />
              <Field label="Initials" value={content.profile.initials} onChange={(v) => patchProfile("initials", v)} />
              <Field label="First name" value={content.profile.firstName} onChange={(v) => patchProfile("firstName", v)} />
              <Field label="Last name" value={content.profile.lastName} onChange={(v) => patchProfile("lastName", v)} />
              <Field label="Role (full)" value={content.profile.role} onChange={(v) => patchProfile("role", v)} />
              <Field label="Availability" value={content.profile.availability} onChange={(v) => patchProfile("availability", v)} />
              <Field label="Hero role line A" value={content.profile.roleLineA} onChange={(v) => patchProfile("roleLineA", v)} />
              <Field label="Hero role line B" value={content.profile.roleLineB} onChange={(v) => patchProfile("roleLineB", v)} />
              <Field label="Phone" value={content.profile.phone} onChange={(v) => patchProfile("phone", v)} />
              <Field label="Email" value={content.profile.email} onChange={(v) => patchProfile("email", v)} />
              <Field label="Address" value={content.profile.address} onChange={(v) => patchProfile("address", v)} />
              <Field label="Short location" value={content.profile.locationShort} onChange={(v) => patchProfile("locationShort", v)} />
              <Field label="Focus label" value={content.profile.focusLabel} onChange={(v) => patchProfile("focusLabel", v)} />
              <Field label="Focus value" value={content.profile.focusValue} onChange={(v) => patchProfile("focusValue", v)} />
              <div className="sm:col-span-2">
                <Field label="Tagline" value={content.profile.tagline} onChange={(v) => patchProfile("tagline", v)} area />
              </div>
              <div className="sm:col-span-2">
                <Field label="Motto" value={content.profile.motto} onChange={(v) => patchProfile("motto", v)} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Professional summary" value={content.profile.profileText} onChange={(v) => patchProfile("profileText", v)} area />
              </div>
            </div>
          )}

          {tab === "Photo" && (
            <div className="flex flex-col gap-4">
              <p className="text-[13px] text-inksoft">
                Upload a portrait for the home page frame. Square or 4:5 portrait works best. Stored inside the site
                itself — keep it under ~500 KB for fast loading.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-36 w-28 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                  {content.profile.photo ? (
                    <img src={content.profile.photo} alt="preview" className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="grid h-full place-items-center text-[11px] text-gray-400">No photo</div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl bg-gblue px-4 py-2.5 text-[12.5px] font-bold text-white"
                  >
                    <ImageIcon className="h-4 w-4" /> Choose image
                  </button>
                  {content.profile.photo && (
                    <>
                      <span className="text-[11.5px] text-gray-500">~{photoKb} KB embedded</span>
                      <button
                        onClick={() => patchProfile("photo", "")}
                        className="flex items-center gap-2 rounded-xl bg-gred/10 px-4 py-2.5 text-[12.5px] font-bold text-gred"
                      >
                        <Trash2 className="h-4 w-4" /> Remove photo
                      </button>
                    </>
                  )}
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
              <Field
                label="…or paste an image URL"
                value={content.profile.photo.startsWith("data:") ? "" : content.profile.photo}
                onChange={(v) => patchProfile("photo", v)}
              />
            </div>
          )}

          {tab === "Email" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-gblue/8 p-4 ring-1 ring-gblue/20">
                <p className="text-[13px] font-bold text-ink">Make the contact form send real email</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[12.5px] leading-relaxed text-inksoft">
                  <li>
                    Go to <span className="font-mono font-bold">web3forms.com</span> and enter your email
                    ({content.profile.email}).
                  </li>
                  <li>They email you a free Access Key — copy it.</li>
                  <li>Paste it below and press Save.</li>
                </ol>
                <p className="mt-2 text-[12px] text-gray-500">
                  Until a key is added, the form falls back to opening the visitor's mail app.
                </p>
              </div>
              <Field
                label="Web3Forms access key"
                value={content.settings.web3formsKey}
                onChange={(v) => setContent((p) => ({ ...p, settings: { ...p.settings, web3formsKey: v } }))}
              />
              <Field
                label="Contact intro note"
                value={content.settings.contactNote}
                onChange={(v) => setContent((p) => ({ ...p, settings: { ...p.settings, contactNote: v } }))}
                area
              />
            </div>
          )}

          {tab === "Socials" && (
            <div className="flex flex-col gap-3">
              {content.socials.map((s, i) => (
                <Card
                  key={i}
                  title={s.label}
                  onDelete={() => patch("socials", content.socials.filter((_, j) => j !== i))}
                >
                  {(["label", "handle", "href"] as const).map((k) => (
                    <Field
                      key={k}
                      label={k}
                      value={s[k]}
                      onChange={(v) => patch("socials", content.socials.map((x, j) => (j === i ? { ...x, [k]: v } : x)))}
                    />
                  ))}
                  <Select
                    label="icon"
                    value={s.icon}
                    options={["whatsapp", "facebook", "linkedin", "mail"]}
                    onChange={(v) => patch("socials", content.socials.map((x, j) => (j === i ? { ...x, icon: v } : x)))}
                  />
                </Card>
              ))}
              <AddButton
                onClick={() =>
                  patch("socials", [...content.socials, { label: "New", handle: "", href: "", icon: "mail" }])
                }
              />
            </div>
          )}

          {tab === "Stats" && (
            <div className="flex flex-col gap-3">
              {content.stats.map((s, i) => (
                <Card key={i} title={s.label} onDelete={() => patch("stats", content.stats.filter((_, j) => j !== i))}>
                  <Field
                    label="value"
                    type="number"
                    value={s.value}
                    onChange={(v) => patch("stats", content.stats.map((x, j) => (j === i ? { ...x, value: Number(v) || 0 } : x)))}
                  />
                  <Field
                    label="suffix"
                    value={s.suffix}
                    onChange={(v) => patch("stats", content.stats.map((x, j) => (j === i ? { ...x, suffix: v } : x)))}
                  />
                  <Field
                    label="label"
                    value={s.label}
                    onChange={(v) => patch("stats", content.stats.map((x, j) => (j === i ? { ...x, label: v } : x)))}
                  />
                  <Select
                    label="colour"
                    value={s.color}
                    options={["text-gblue", "text-gred", "text-gyellow", "text-ggreen"]}
                    onChange={(v) => patch("stats", content.stats.map((x, j) => (j === i ? { ...x, color: v } : x)))}
                  />
                </Card>
              ))}
              <AddButton
                onClick={() => patch("stats", [...content.stats, { value: 0, suffix: "", label: "New stat", color: "text-gblue" }])}
              />
            </div>
          )}

          {tab === "Chips" && (
            <div className="flex flex-col gap-3">
              <p className="text-[12.5px] text-inksoft">Floating labels around your photo (first 6 are shown).</p>
              {content.portraitChips.map((c, i) => (
                <Card key={i} title={c.label} onDelete={() => patch("portraitChips", content.portraitChips.filter((_, j) => j !== i))}>
                  <Field
                    label="label"
                    value={c.label}
                    onChange={(v) => patch("portraitChips", content.portraitChips.map((x, j) => (j === i ? { ...x, label: v } : x)))}
                  />
                  <Select
                    label="icon"
                    value={c.iconName}
                    options={ICON_NAMES}
                    onChange={(v) => patch("portraitChips", content.portraitChips.map((x, j) => (j === i ? { ...x, iconName: v } : x)))}
                  />
                  <Select
                    label="colour"
                    value={c.color}
                    options={ACCENTS}
                    onChange={(v) => patch("portraitChips", content.portraitChips.map((x, j) => (j === i ? { ...x, color: v as never } : x)))}
                  />
                </Card>
              ))}
              <AddButton
                onClick={() => patch("portraitChips", [...content.portraitChips, { label: "New chip", iconName: "Sparkles", color: "gblue" }])}
              />
            </div>
          )}

          {tab === "Highlights" && (
            <div className="flex flex-col gap-3">
              {content.highlights.map((h, i) => (
                <Card key={i} title={h.title} onDelete={() => patch("highlights", content.highlights.filter((_, j) => j !== i))}>
                  <Field label="title" value={h.title} onChange={(v) => patch("highlights", content.highlights.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
                  <Field label="detail" area value={h.detail} onChange={(v) => patch("highlights", content.highlights.map((x, j) => (j === i ? { ...x, detail: v } : x)))} />
                  <Select label="icon" value={h.iconName} options={ICON_NAMES} onChange={(v) => patch("highlights", content.highlights.map((x, j) => (j === i ? { ...x, iconName: v } : x)))} />
                  <Select label="colour" value={h.color} options={ACCENTS} onChange={(v) => patch("highlights", content.highlights.map((x, j) => (j === i ? { ...x, color: v as never } : x)))} />
                </Card>
              ))}
              <AddButton onClick={() => patch("highlights", [...content.highlights, { iconName: "Star", color: "gblue", title: "New highlight", detail: "" }])} />
            </div>
          )}

          {tab === "Systems" && (
            <div className="flex flex-col gap-3">
              {content.systemsBuilt.map((s, i) => (
                <Card key={i} title={s.title} onDelete={() => patch("systemsBuilt", content.systemsBuilt.filter((_, j) => j !== i))}>
                  <Field label="title" value={s.title} onChange={(v) => patch("systemsBuilt", content.systemsBuilt.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
                  <Field label="detail" area value={s.detail} onChange={(v) => patch("systemsBuilt", content.systemsBuilt.map((x, j) => (j === i ? { ...x, detail: v } : x)))} />
                  <StringList label="tags" items={s.tags} onChange={(v) => patch("systemsBuilt", content.systemsBuilt.map((x, j) => (j === i ? { ...x, tags: v } : x)))} />
                  <Select label="icon" value={s.iconName} options={ICON_NAMES} onChange={(v) => patch("systemsBuilt", content.systemsBuilt.map((x, j) => (j === i ? { ...x, iconName: v } : x)))} />
                  <Select label="colour" value={s.color} options={ACCENTS} onChange={(v) => patch("systemsBuilt", content.systemsBuilt.map((x, j) => (j === i ? { ...x, color: v as never } : x)))} />
                </Card>
              ))}
              <AddButton onClick={() => patch("systemsBuilt", [...content.systemsBuilt, { iconName: "Globe", color: "gblue", title: "New system", detail: "", tags: [] }])} />
            </div>
          )}

          {tab === "Experience" && (
            <div className="flex flex-col gap-3">
              {content.experience.map((e, i) => {
                const up = (patchObj: Partial<(typeof content.experience)[number]>) =>
                  patch("experience", content.experience.map((x, j) => (j === i ? { ...x, ...patchObj } : x)));
                return (
                  <Card key={i} title={e.role} onDelete={() => patch("experience", content.experience.filter((_, j) => j !== i))}>
                    <Field label="role" value={e.role} onChange={(v) => up({ role: v })} />
                    <Field label="company" value={e.company} onChange={(v) => up({ company: v })} />
                    <Field label="period" value={e.period} onChange={(v) => up({ period: v })} />
                    <Field label="type / badge" value={e.type} onChange={(v) => up({ type: v })} />
                    <StringList label="bullet points" items={e.points} onChange={(v) => up({ points: v })} />
                    <StringList label="key area tags" items={e.tags} onChange={(v) => up({ tags: v })} />
                    <Select label="icon" value={e.iconName} options={ICON_NAMES} onChange={(v) => up({ iconName: v })} />
                    <Select label="colour" value={e.color} options={ACCENTS} onChange={(v) => up({ color: v as never })} />
                    <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                      <input type="checkbox" checked={e.current} onChange={(ev) => up({ current: ev.target.checked })} />
                      Mark as current role
                    </label>
                  </Card>
                );
              })}
              <AddButton
                onClick={() =>
                  patch("experience", [
                    ...content.experience,
                    { company: "", iconName: "Building2", color: "gblue", role: "New role", period: "", type: "", current: false, points: [], tags: [] },
                  ])
                }
              />
            </div>
          )}

          {tab === "Skills" && (
            <div className="flex flex-col gap-3">
              {content.skillCategories.map((c, i) => {
                const up = (p: Partial<(typeof content.skillCategories)[number]>) =>
                  patch("skillCategories", content.skillCategories.map((x, j) => (j === i ? { ...x, ...p } : x)));
                return (
                  <Card key={i} title={c.title} onDelete={() => patch("skillCategories", content.skillCategories.filter((_, j) => j !== i))}>
                    <Field label="title" value={c.title} onChange={(v) => up({ title: v })} />
                    <Field label="blurb" value={c.blurb} onChange={(v) => up({ blurb: v })} />
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gray-500">skills & levels</span>
                      <div className="mt-2 flex flex-col gap-2">
                        {c.skills.map((s, k) => (
                          <div key={k} className="flex gap-2">
                            <input
                              value={s.name}
                              onChange={(ev) => up({ skills: c.skills.map((y, m) => (m === k ? { ...y, name: ev.target.value } : y)) })}
                              className="field"
                            />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={s.level}
                              onChange={(ev) => up({ skills: c.skills.map((y, m) => (m === k ? { ...y, level: Number(ev.target.value) || 0 } : y)) })}
                              className="field w-24 shrink-0"
                            />
                            <button
                              type="button"
                              onClick={() => up({ skills: c.skills.filter((_, m) => m !== k) })}
                              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gred/10 text-gred"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => up({ skills: [...c.skills, { name: "", level: 80 }] })}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2.5 text-[12px] font-bold text-inksoft hover:border-gblue hover:text-gblue"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add skill
                        </button>
                      </div>
                    </div>
                    <StringList label="extra tools (optional)" items={c.extraTools ?? []} onChange={(v) => up({ extraTools: v })} />
                    <Field label="button label (optional)" value={c.ctaLabel ?? ""} onChange={(v) => up({ ctaLabel: v })} />
                    <Field label="button link (optional)" value={c.ctaHref ?? ""} onChange={(v) => up({ ctaHref: v })} />
                    <Select label="icon" value={c.iconName} options={ICON_NAMES} onChange={(v) => up({ iconName: v })} />
                    <Select label="colour" value={c.accent} options={ACCENTS} onChange={(v) => up({ accent: v as never })} />
                  </Card>
                );
              })}
              <AddButton
                onClick={() =>
                  patch("skillCategories", [
                    ...content.skillCategories,
                    { title: "New category", iconName: "Brain", accent: "gblue", blurb: "", skills: [] },
                  ])
                }
              />
            </div>
          )}

          {tab === "Tools" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <StringList label="Software & tools" items={content.softwareTools} onChange={(v) => patch("softwareTools", v)} />
              <StringList label="Soft skills & leadership" items={content.softSkills} onChange={(v) => patch("softSkills", v)} />
              <div className="sm:col-span-2">
                <StringList label="Marquee ticker items" items={content.marqueeTech} onChange={(v) => patch("marqueeTech", v)} />
              </div>
            </div>
          )}

          {tab === "Certifications" && (
            <div className="flex flex-col gap-3">
              {content.certifications.map((c, i) => {
                const up = (p: Partial<(typeof content.certifications)[number]>) =>
                  patch("certifications", content.certifications.map((x, j) => (j === i ? { ...x, ...p } : x)));
                return (
                  <Card key={i} title={c.name} onDelete={() => patch("certifications", content.certifications.filter((_, j) => j !== i))}>
                    <Field label="name" value={c.name} onChange={(v) => up({ name: v })} />
                    <Field label="issuer" value={c.issuer} onChange={(v) => up({ issuer: v })} />
                    <Field label="badge" value={c.badge} onChange={(v) => up({ badge: v })} />
                    <Field label="detail" area value={c.detail} onChange={(v) => up({ detail: v })} />
                    <StringList label="skill tags" items={c.skills} onChange={(v) => up({ skills: v })} />
                    <Select label="icon" value={c.iconName} options={ICON_NAMES} onChange={(v) => up({ iconName: v })} />
                    <Select label="colour" value={c.color} options={ACCENTS} onChange={(v) => up({ color: v as never })} />
                  </Card>
                );
              })}
              <AddButton
                onClick={() =>
                  patch("certifications", [
                    ...content.certifications,
                    { iconName: "Award", color: "gblue", name: "New certificate", issuer: "", badge: "", detail: "", skills: [] },
                  ])
                }
              />
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.13em] text-gray-500">Additional trainings</p>
              {content.additionalTrainings.map((t, i) => (
                <Card key={i} title={t.name} onDelete={() => patch("additionalTrainings", content.additionalTrainings.filter((_, j) => j !== i))}>
                  <Field label="name" value={t.name} onChange={(v) => patch("additionalTrainings", content.additionalTrainings.map((x, j) => (j === i ? { ...x, name: v } : x)))} />
                  <Field label="issuer" value={t.issuer} onChange={(v) => patch("additionalTrainings", content.additionalTrainings.map((x, j) => (j === i ? { ...x, issuer: v } : x)))} />
                  <Select label="icon" value={t.iconName} options={ICON_NAMES} onChange={(v) => patch("additionalTrainings", content.additionalTrainings.map((x, j) => (j === i ? { ...x, iconName: v } : x)))} />
                  <Select label="colour" value={t.color} options={ACCENTS} onChange={(v) => patch("additionalTrainings", content.additionalTrainings.map((x, j) => (j === i ? { ...x, color: v as never } : x)))} />
                </Card>
              ))}
              <AddButton onClick={() => patch("additionalTrainings", [...content.additionalTrainings, { iconName: "Leaf", color: "ggreen", name: "New training", issuer: "" }])} />
            </div>
          )}

          {tab === "Education" && (
            <div className="flex flex-col gap-3">
              {content.education.map((e, i) => {
                const up = (p: Partial<(typeof content.education)[number]>) =>
                  patch("education", content.education.map((x, j) => (j === i ? { ...x, ...p } : x)));
                return (
                  <Card key={i} title={e.degree} onDelete={() => patch("education", content.education.filter((_, j) => j !== i))}>
                    <Field label="degree" value={e.degree} onChange={(v) => up({ degree: v })} />
                    <Field label="school" value={e.school} onChange={(v) => up({ school: v })} />
                    <Field label="period" value={e.period} onChange={(v) => up({ period: v })} />
                    <Field label="score (leave blank to hide)" value={e.score} onChange={(v) => up({ score: v })} />
                    <Select label="icon" value={e.iconName} options={ICON_NAMES} onChange={(v) => up({ iconName: v })} />
                    <Select label="colour" value={e.color} options={ACCENTS} onChange={(v) => up({ color: v as never })} />
                    <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                      <input type="checkbox" checked={e.current} onChange={(ev) => up({ current: ev.target.checked })} />
                      Currently running
                    </label>
                  </Card>
                );
              })}
              <AddButton
                onClick={() =>
                  patch("education", [
                    ...content.education,
                    { iconName: "GraduationCap", color: "gblue", degree: "New degree", school: "", period: "", score: "", current: false },
                  ])
                }
              />
            </div>
          )}

          {tab === "Languages" && (
            <div className="flex flex-col gap-3">
              {content.languages.map((l, i) => {
                const up = (p: Partial<(typeof content.languages)[number]>) =>
                  patch("languages", content.languages.map((x, j) => (j === i ? { ...x, ...p } : x)));
                return (
                  <Card key={i} title={l.name} onDelete={() => patch("languages", content.languages.filter((_, j) => j !== i))}>
                    <Field label="language" value={l.name} onChange={(v) => up({ name: v })} />
                    <Field label="level" value={l.level} onChange={(v) => up({ level: v })} />
                    <Field label="percent" type="number" value={l.percent} onChange={(v) => up({ percent: Number(v) || 0 })} />
                    <Select label="colour" value={l.color} options={ACCENTS} onChange={(v) => up({ color: v as never })} />
                  </Card>
                );
              })}
              <AddButton onClick={() => patch("languages", [...content.languages, { name: "New", level: "", percent: 50, color: "gblue" }])} />
            </div>
          )}

          {tab === "Backup" && (
            <div className="flex flex-col gap-4">
              <p className="text-[13px] leading-relaxed text-inksoft">
                Changes are stored in this browser. Export a backup file to keep your edits safe or move them to another
                device/browser.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button onClick={exportJson} className="flex items-center gap-2 rounded-xl bg-gblue px-4 py-2.5 text-[12.5px] font-bold text-white">
                  <Download className="h-4 w-4" /> Export backup
                </button>
                <button onClick={() => jsonRef.current?.click()} className="flex items-center gap-2 rounded-xl bg-ggreen px-4 py-2.5 text-[12.5px] font-bold text-white">
                  <Upload className="h-4 w-4" /> Import backup
                </button>
                <button
                  onClick={() => {
                    if (confirm("Reset ALL content back to the original defaults?")) {
                      reset();
                      flash("Reset to defaults");
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gred/10 px-4 py-2.5 text-[12.5px] font-bold text-gred"
                >
                  <RotateCcw className="h-4 w-4" /> Reset everything
                </button>
              </div>
              <input ref={jsonRef} type="file" accept="application/json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
              <details className="rounded-2xl bg-gray-50 p-4">
                <summary className="cursor-pointer text-[12.5px] font-bold text-ink">View raw JSON</summary>
                <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-white p-3 text-[10.5px] leading-relaxed text-inksoft">
                  {JSON.stringify(content, (k, v) => (k === "photo" && typeof v === "string" && v.length > 80 ? "[image data]" : v), 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          Defaults ship with the site · {Object.keys(defaultContent).length} content groups editable
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[12.5px] font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
export default function Admin() {
  const [authed, setAuthed] = useState(() => isAuthed());

  // Keep the page out of search engines while it is mounted.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Console";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  // Re-check expiry periodically so an idle tab drops out of the console.
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => {
      if (!isAuthed()) setAuthed(false);
    }, 15000);
    return () => clearInterval(t);
  }, [authed]);

  return authed ? <Console onExit={() => setAuthed(false)} /> : <LoginGate onPass={() => setAuthed(true)} />;
}
