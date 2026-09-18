/**
 * Browser token storage for the seller portal.
 *
 * A deliberate duplicate of `packages/api-client/src/token-storage.ts`.
 * The seller app is the one front-end that does NOT depend on
 * `@yukizi/api-client` — it has its own `lib/apiClient.ts` and its own
 * `api/seller.api.ts` — so it cannot import the shared helper without adding
 * a new package dependency to a live app. Copying ~40 lines is the smaller
 * risk. If the seller app ever takes that dependency, delete this file and
 * import from the package instead.
 *
 * Why it exists at all: the storage keys used to be `pb_access_token` /
 * `pb_refresh_token` / `pb_token` — "pb" for PharmaBag, inherited with the
 * fork. Renaming them is cosmetic, but a straight find-and-replace would make
 * every logged-in seller appear logged out on the next deploy: their session
 * is still valid server-side, the browser is just looking under the wrong
 * key. So reads fall back to the legacy names and migrate them forward.
 */

const ACCESS_KEY = 'yz_access_token';
const REFRESH_KEY = 'yz_refresh_token';

/** Old names, newest first. `pb_token` predates the access/refresh split. */
const LEGACY_ACCESS_KEYS = ['pb_access_token', 'pb_token'];
const LEGACY_REFRESH_KEYS = ['pb_refresh_token'];

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/** Treats the literal strings "undefined"/"null" as empty — they get stored
 *  when a value is stringified by mistake, which has happened here before. */
function clean(v: string | null): string | null {
  return v && v !== 'undefined' && v !== 'null' ? v : null;
}

function readWithMigration(key: string, legacyKeys: string[]): string | null {
  if (!hasWindow()) return null;

  const current = clean(localStorage.getItem(key));
  if (current) return current;

  for (const legacy of legacyKeys) {
    const value = clean(localStorage.getItem(legacy));
    if (value) {
      try {
        localStorage.setItem(key, value);
        localStorage.removeItem(legacy);
      } catch {
        // A full or locked localStorage must never break authentication.
      }
      return value;
    }
  }
  return null;
}

export function readAccessToken(): string | null {
  return readWithMigration(ACCESS_KEY, LEGACY_ACCESS_KEYS);
}

export function writeAccessToken(token: string | null): void {
  if (!hasWindow()) return;
  try {
    if (clean(token)) {
      localStorage.setItem(ACCESS_KEY, token as string);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }
    // Never leave a stale copy under an old name — it could be picked up by a
    // cached build and resurrect a session that was just cleared.
    for (const legacy of LEGACY_ACCESS_KEYS) localStorage.removeItem(legacy);
  } catch {
    /* storage unavailable */
  }
}

/** Clears both tokens under every name, new and legacy. Used on logout/401. */
export function clearTokens(): void {
  if (!hasWindow()) return;
  try {
    for (const k of [
      ACCESS_KEY,
      REFRESH_KEY,
      ...LEGACY_ACCESS_KEYS,
      ...LEGACY_REFRESH_KEYS,
    ]) {
      localStorage.removeItem(k);
    }
  } catch {
    /* nothing useful to do */
  }
}
