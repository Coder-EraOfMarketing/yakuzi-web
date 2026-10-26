import { describe, it, expect } from 'vitest';
import { decideOn401, isAuthEndpoint } from './session-refresh';

const base = {
  status: 401,
  url: '/auth/me',
  hasRequestConfig: true,
  hasRefreshToken: true,
  isRefreshing: false,
};

describe('decideOn401', () => {
  it('refreshes an ordinary expired-session 401', () => {
    // The whole point: this used to be an immediate logout.
    expect(decideOn401(base)).toBe('refresh');
  });

  it('ignores anything that is not a 401', () => {
    for (const status of [200, 400, 403, 404, 500, undefined]) {
      expect(decideOn401({ ...base, status })).toBe('ignore');
    }
  });

  it('queues instead of refreshing when a refresh is already in flight', () => {
    // Parallel 401s must share ONE rotation. If each refreshed, every loser of
    // the race would be left holding a token that was already rotated away.
    expect(decideOn401({ ...base, isRefreshing: true })).toBe('queue');
  });

  it('ends the session rather than looping when the replay also 401s', () => {
    expect(decideOn401({ ...base, alreadyRetried: true })).toBe('end-session');
  });

  it('ends the session when there is no refresh token stored', () => {
    // Sellers logged in before refresh-token storage shipped. One final
    // logout, then every later session refreshes normally.
    expect(decideOn401({ ...base, hasRefreshToken: false })).toBe('end-session');
  });

  it('ends the session when the error carries no request to replay', () => {
    expect(decideOn401({ ...base, hasRequestConfig: false })).toBe('end-session');
  });

  it.each([
    '/auth/refresh',
    '/auth/verify-otp',
    '/auth/send-otp',
    '/auth/login',
    '/auth/register',
    'https://api.dev.yukizi.com/api/auth/verify-otp',
  ])('never refreshes in response to %s', (url) => {
    // A wrong OTP is a wrong OTP. Refreshing here would hide the real error
    // behind a logout — and on /auth/refresh it would recurse.
    expect(decideOn401({ ...base, url })).toBe('end-session');
  });

  it('still refreshes for paths that merely contain the word auth', () => {
    // Guard against an over-broad match killing legitimate endpoints.
    for (const url of ['/sellers/author-profile', '/products?q=auth', '/auth/me']) {
      expect(decideOn401({ ...base, url })).toBe('refresh');
    }
  });

  it('checks retry before the auth-endpoint rule, and both before queueing', () => {
    // Ordering matters: a retried request must not be parked in the queue
    // forever waiting on a refresh that will never satisfy it.
    expect(
      decideOn401({ ...base, alreadyRetried: true, isRefreshing: true }),
    ).toBe('end-session');
  });
});

describe('isAuthEndpoint', () => {
  it('is false for undefined and for ordinary paths', () => {
    expect(isAuthEndpoint(undefined)).toBe(false);
    expect(isAuthEndpoint('/orders')).toBe(false);
    expect(isAuthEndpoint('/auth/me')).toBe(false);
  });

  it('is true for credential endpoints', () => {
    expect(isAuthEndpoint('/auth/verify-otp')).toBe(true);
    expect(isAuthEndpoint('/auth/refresh')).toBe(true);
  });
});
