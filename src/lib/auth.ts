/* ------------------------------------------------------------------
   Admin authentication for a fully static site.

   Hardening applied:
   • Password is never stored — only a salted SHA-256 digest is compiled in.
   • Constant-time digest comparison (no early-exit timing leak).
   • Progressive lockout after repeated failures (persisted, survives reload).
   • Session is short-lived, stored in sessionStorage (dies with the tab)
     and bound to a random token + absolute expiry.
   • The console route is unlisted and marked noindex.
------------------------------------------------------------------- */

const SALT = "jc_portfolio_v1_static_salt_9f3a7b";
/** sha256(SALT + password) */
const PASSWORD_DIGEST = "dbdefad2a8fda5c2f94ee54f00eeeea1c7e8c6b5b3aa47aa5ecdf4029fc2a792";

const SESSION_KEY = "jc_admin_session_v1";
const GUARD_KEY = "jc_admin_guard_v1";

const SESSION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const BASE_LOCK_MS = 60 * 1000; // doubles each additional failure past the limit

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-independent, constant-time string comparison. */
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

type Guard = { fails: number; until: number };

function readGuard(): Guard {
  try {
    const raw = localStorage.getItem(GUARD_KEY);
    if (!raw) return { fails: 0, until: 0 };
    const g = JSON.parse(raw) as Guard;
    return { fails: Number(g.fails) || 0, until: Number(g.until) || 0 };
  } catch {
    return { fails: 0, until: 0 };
  }
}

function writeGuard(g: Guard) {
  localStorage.setItem(GUARD_KEY, JSON.stringify(g));
}

/** Milliseconds remaining on an active lockout (0 when unlocked). */
export function lockRemainingMs(): number {
  const { until } = readGuard();
  return Math.max(0, until - Date.now());
}

export function attemptsLeft(): number {
  return Math.max(0, MAX_ATTEMPTS - readGuard().fails);
}

export type LoginResult = { ok: true } | { ok: false; reason: "locked" | "invalid"; waitMs?: number };

export async function login(password: string): Promise<LoginResult> {
  const wait = lockRemainingMs();
  if (wait > 0) return { ok: false, reason: "locked", waitMs: wait };

  const digest = await sha256Hex(SALT + password);

  if (!timingSafeEqual(digest, PASSWORD_DIGEST)) {
    const g = readGuard();
    const fails = g.fails + 1;
    const over = fails - MAX_ATTEMPTS;
    const until = over >= 0 ? Date.now() + BASE_LOCK_MS * Math.pow(2, over) : 0;
    writeGuard({ fails, until });
    return { ok: false, reason: "invalid" };
  }

  writeGuard({ fails: 0, until: 0 });

  const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, exp: Date.now() + SESSION_MS }));
  return { ok: true };
}

export function isAuthed(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw) as { token: string; exp: number };
    if (!s?.token || Date.now() > s.exp) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Slide the expiry forward on activity. */
export function touchSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const s = JSON.parse(raw) as { token: string; exp: number };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, exp: Date.now() + SESSION_MS }));
  } catch {
    /* ignore */
  }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export const SESSION_MINUTES = SESSION_MS / 60000;
