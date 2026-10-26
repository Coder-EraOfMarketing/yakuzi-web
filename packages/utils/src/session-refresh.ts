/**
 * What a front-end should do when a request comes back 401.
 *
 * Pure policy, deliberately separated from the axios plumbing that applies it.
 * The seller portal used to answer every 401 by clearing the session and
 * redirecting to /auth, which silently returned sellers to a blank login form
 * whenever their access token aged out mid-session — reported as "I enter the
 * OTP and it just asks me to log in again". The admin app still does this.
 *
 * The branching is the part that is easy to get wrong and impossible to eyeball
 * (loops on the refresh call itself, a logout storm from parallel 401s, a
 * failed OTP masquerading as an expired session), so it lives here where it can
 * be tested without a browser, an axios instance or a running API.
 */

export type RefreshDecision =
  /** Rotate the tokens, then replay the original request. */
  | 'refresh'
  /** A refresh is already running — wait for it and replay with the new token. */
  | 'queue'
  /** Unrecoverable: clear tokens and send the user to the login screen. */
  | 'end-session'
  /** Not an auth problem; let normal error handling deal with it. */
  | 'ignore';

export interface Refresh401Input {
  /** HTTP status of the failed response, if there was one. */
  status?: number;
  /** Request URL, used to spot auth endpoints. */
  url?: string;
  /** Has this request already been replayed once? */
  alreadyRetried?: boolean;
  /** False when the error carries no request config to replay. */
  hasRequestConfig: boolean;
  /** False when no refresh token is stored — nothing to refresh with. */
  hasRefreshToken: boolean;
  /** True when another request is already refreshing. */
  isRefreshing: boolean;
}

/**
 * Endpoints where a 401 means "those credentials are wrong", not "your session
 * expired". Refreshing after a failed OTP would swallow the real error and log
 * the user out instead of showing them what went wrong.
 */
export function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return /\/auth\/(send-otp|verify-otp|refresh|login|register)\b/.test(url);
}

export function decideOn401(input: Refresh401Input): RefreshDecision {
  const {
    status,
    url,
    alreadyRetried = false,
    hasRequestConfig,
    hasRefreshToken,
    isRefreshing,
  } = input;

  if (status !== 401) return 'ignore';

  // Nothing to replay, or we already tried once and got 401 again — a second
  // refresh would just loop.
  if (!hasRequestConfig || alreadyRetried) return 'end-session';

  // Never refresh in response to the refresh call itself, or to a login
  // attempt that was simply wrong.
  if (isAuthEndpoint(url)) return 'end-session';

  // Sessions predating refresh-token storage have nothing to refresh with.
  if (!hasRefreshToken) return 'end-session';

  // One refresh serves every request that failed while it was in flight.
  // Without this, parallel 401s each rotate the token and all but the winner
  // end up holding an already-rotated, now-invalid one.
  if (isRefreshing) return 'queue';

  return 'refresh';
}
