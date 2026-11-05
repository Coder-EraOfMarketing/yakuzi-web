'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@yukizi/api-client';
import { useToast } from '@/components/shared/Toast';
import { loadScript } from '@/lib/load-script';
import { FacebookIcon } from './SocialIcons';

/**
 * Pinned, not "latest": Graph API versions are retired about two years after
 * release, and a retired version fails every login at once. Bump this when
 * Meta's changelog says so.
 */
const GRAPH_VERSION = 'v23.0';

interface FacebookSDK {
  init(opts: { appId: string; cookie: boolean; xfbml: boolean; version: string }): void;
  login(
    cb: (res: { authResponse?: { accessToken?: string } | null; status?: string }) => void,
    opts: { scope: string },
  ): void;
}

interface FacebookSignInButtonProps {
  /** Only load Facebook's script while the control is on screen (the modal passes its open state). */
  active?: boolean;
  onSuccess?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Sign in with Facebook. Renders the disabled "not available yet" icon until
 * NEXT_PUBLIC_FACEBOOK_APP_ID is set, so merging this before the Meta app exists
 * changes nothing on screen.
 *
 * FB.login opens a popup, and browsers only allow a popup from a direct user
 * click. That is why the SDK is loaded on mount rather than on click: by the time
 * the click happens, `FB` must already be there.
 */
export default function FacebookSignInButton({
  active = true,
  onSuccess,
  onLoadingChange,
}: FacebookSignInButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { loginWithFacebook } = useAuth();
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!active || !appId) return;
    let cancelled = false;
    loadScript('facebook-jssdk', 'https://connect.facebook.net/en_US/sdk.js')
      .then(() => {
        const FB = (window as unknown as { FB?: FacebookSDK }).FB;
        if (cancelled || !FB) return;
        // cookie:false — nothing here needs Facebook's session cookie, and the
        // server, not the browser, decides who is logged in.
        FB.init({ appId, cookie: false, xfbml: false, version: GRAPH_VERSION });
        setReady(true);
      })
      .catch(() => {
        // Blocked by an ad blocker or offline: the icon simply stays inactive.
      });
    return () => {
      cancelled = true;
    };
  }, [active, appId]);

  const handleClick = useCallback(() => {
    const FB = (window as unknown as { FB?: FacebookSDK }).FB;
    if (!FB || busy) return;

    // Called synchronously from the click so the popup is not blocked.
    FB.login(
      (res) => {
        const token = res.authResponse?.accessToken;
        // No token = the person closed the popup or declined. Not an error.
        if (!token) return;
        setBusy(true);
        onLoadingChange?.(true);
        loginWithFacebook(token)
          .then(() => {
            toast('Login successful!', 'success');
            onSuccess?.();
            router.push('/');
          })
          .catch((e: any) => {
            toast(
              e?.response?.data?.message || 'Facebook sign-in failed. Please try again.',
              'error',
            );
          })
          .finally(() => {
            setBusy(false);
            onLoadingChange?.(false);
          });
      },
      // public_profile + email are the defaults that need no Meta app review.
      { scope: 'public_profile,email' },
    );
  }, [busy, loginWithFacebook, onLoadingChange, onSuccess, router, toast]);

  return <FacebookIcon onClick={appId && ready ? handleClick : undefined} busy={busy} />;
}
