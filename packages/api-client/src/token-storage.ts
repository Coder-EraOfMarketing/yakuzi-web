/**
 * Where login tokens live in the browser, and how they got renamed safely.
 *
 * The keys used to be `pb_access_token` / `pb_refresh_token` / `pb_token` —
 * "pb" for PharmaBag, inherited with the fork. Renaming them is cosmetic, but
 * doing it carelessly is not: the keys are read in five files across three
 * apps, and a straight find-and-replace would make every currently-logged-in
 * buyer, seller and admin look logged out the moment they loaded the new
 * build. Their session would still be valid on the server; the browser would
 * simply be looking in the wrong drawer.
 *
 * So reads fall back to the legacy keys and migrate them forward on the spot:
 *
 *   read  -> new key; if empty, check each legacy key, and the first hit is
 *            copied to the new key and erased from the old one
 *   write -> new key only, legacy keys erased
 *   clear -> new key and every legacy key
 *
 * The result is that an existing session moves across silently on the user's
 * next page load, and nobody is signed out. The legacy fallbacks can be
 * deleted once you are confident every active session has rotated — access
 * tokens last 15 minutes and refresh tokens 7 days, so a month is ample.
 *
 * This module is intentionally dependency-free and guards every access with a
 * `typeof window` check, because it is imported into code that also runs
 * during server rendering.
 */

const ACCESS_KEY = 'yz_access_token';
const REFRESH_KEY = 'yz_refresh_token';

/** Old names, newest first. `pb_token` predates the access/refresh split. */
const LEGACY_ACCESS_KEYS = ['pb_access_token', 'pb_token'];
const LEGACY_REFRESH_KEYS = ['pb_refresh_token'];

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Reads a key, migrating from a legacy name if that is where the value is.
 *
 * Also treats the literal strings "undefined" and "null" as empty. Those get
 * written when a value is stringified by mistake, and the previous code had
 * a specific guard for exactly that — so it has happened.
 */
function readWithMigration(key: string, legacyKeys: string[]): string | null {
  if (!hasWindow()) return null;

  const clean = (v: string | null): string | null =>
    v && v !== 'undefined' && v !== 'null' ? v : null;

  const current = clean(localStorage.getItem(key));
  if (current) return current;

  for (const legacy of legacyKeys) {
    const value = clean(localStorage.getItem(legacy));
    if (value) {
      try {
        localStorage.setItem(key, value);
        localStorage.removeItem(legacy);
      } catch {
        // A full or locked localStorage must not break authentication —
        // fall through and return the value we already read.
      }
      return value;
    }
  }
  return null;
}

function write(key: string, legacyKeys: string[], value: string | null): void {
  if (!hasWindow()) return;
  try {
    if (value && value !== 'undefined' && value !== 'null') {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
    // Never leave a stale copy under the old name: it would be picked up by
    // any build still running the pre-rename code and could resurrect a
    // token that has just been cleared on logout.
    for (const legacy of legacyKeys) localStorage.removeItem(legacy);
  } catch {
    /* storage unavailable — in-memory token still works for this tab */
  }
}

export function readAccessToken(): string | null {
  return readWithMigration(ACCESS_KEY, LEGACY_ACCESS_KEYS);
}

export function readRefreshToken(): string | null {
  return readWithMigration(REFRESH_KEY, LEGACY_REFRESH_KEYS);
}

export function writeAccessToken(token: string | null): void {
  write(ACCESS_KEY, LEGACY_ACCESS_KEYS, token);
}

export function writeRefreshToken(token: string | null): void {
  write(REFRESH_KEY, LEGACY_REFRESH_KEYS, token);
}

/** Clears both tokens under every name, new and legacy. Used on logout/401. */
export function clearTokens(): void {
  if (!hasWindow()) return;
  try {
    for (const k of [ACCESS_KEY, REFRESH_KEY, ...LEGACY_ACCESS_KEYS, ...LEGACY_REFRESH_KEYS]) {
      localStorage.removeItem(k);
    }
  } catch {
    /* nothing useful to do */
  }
}

export const TOKEN_KEYS = {
  access: ACCESS_KEY,
  refresh: REFRESH_KEY,
  legacyAccess: LEGACY_ACCESS_KEYS,
  legacyRefresh: LEGACY_REFRESH_KEYS,
} as const;
