import styles from './SocialIcons.module.css';

/**
 * The round sign-in icons shared by /login and the login modal.
 *
 * Google renders its own button when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set and
 * falls back to the static icon here. Facebook and Apple (FacebookSignInButton,
 * AppleSignInButton) pass `onClick` when their provider is configured; with no
 * `onClick` they render disabled with an honest tooltip instead of a button
 * that silently does nothing.
 */
interface ProviderIconProps {
  /** Present only when the provider is configured and ready. */
  onClick?: () => void;
  /** A sign-in is in flight: ignore further clicks. */
  busy?: boolean;
}

export function GoogleFallbackIcon() {
  return (
    <button type="button" className={styles.disc} aria-label="Continue with Google">
      <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
        </g>
      </svg>
    </button>
  );
}

export function FacebookIcon({ onClick, busy }: ProviderIconProps) {
  const live = !!onClick;
  return (
    <button
      type="button"
      disabled={!live || busy}
      onClick={onClick}
      title={live ? 'Continue with Facebook' : 'Facebook sign-in is not available yet'}
      aria-label={live ? 'Continue with Facebook' : 'Facebook sign-in is not available yet'}
      className={live ? styles.disc : `${styles.disc} ${styles.disabled}`}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </button>
  );
}

export function AppleIcon({ onClick, busy }: ProviderIconProps) {
  const live = !!onClick;
  return (
    <button
      type="button"
      disabled={!live || busy}
      onClick={onClick}
      title={live ? 'Continue with Apple' : 'Apple sign-in is not available yet'}
      aria-label={live ? 'Continue with Apple' : 'Apple sign-in is not available yet'}
      className={live ? styles.disc : `${styles.disc} ${styles.disabled}`}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#0f172a" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.55.06 2.85.74 3.65 1.88-3.13 1.82-2.6 5.98.54 7.22-.72 1.76-1.64 3.12-2.77 3.87zm-2.45-13.8c.63-1.64-.17-3.32-1.63-4.15-1.57-.65-3.32.22-3.86 1.95-.57 1.81.4 3.44 1.93 4.04 1.48.59 3.01-.27 3.56-1.84z" />
      </svg>
    </button>
  );
}
