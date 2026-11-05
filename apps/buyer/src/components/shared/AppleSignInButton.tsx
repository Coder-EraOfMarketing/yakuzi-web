'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@yukizi/api-client';
import { useToast } from '@/components/shared/Toast';
import { loadScript } from '@/lib/load-script';
import { AppleIcon } from './SocialIcons';

interface AppleID {
  auth: {
    init(opts: {
      clientId: string;
      scope: string;
      redirectURI: string;
      state: string;
      usePopup: boolean;
    }): void;
    signIn(): Promise<{ authorization?: { id_token?: string } }>;
  };
}

interface AppleSignInButtonProps {
  active?: boolean;
  onSuccess?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Sign in with Apple. Renders the disabled "not available yet" icon until
 * NEXT_PUBLIC_APPLE_CLIENT_ID (the Apple *Services ID*, not the app id) is set.
 *
 * Apple requires `redirectURI` to match a Return URL registered against that
 * Services ID EXACTLY, even in popup mode where the page never navigates there.
 * Default is this origin's /login; override with NEXT_PUBLIC_APPLE_REDIRECT_URI
 * when the registered URL differs.
 */
export default function AppleSignInButton({
  active = true,
  onSuccess,
  onLoadingChange,
}: AppleSignInButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { loginWithApple } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!active || !clientId) return;
    let cancelled = false;
    loadScript(
      'apple-signin-js',
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
    )
      .then(() => {
        const AppleID = (window as unknown as { AppleID?: AppleID }).AppleID;
        if (cancelled || !AppleID) return;
        AppleID.auth.init({
          clientId,
          // `name` is returned only the first time a person authorises, and our
          // server does not read it from here; `email` is what identifies them.
          scope: 'name email',
          redirectURI:
            process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || `${window.location.origin}/login`,
          state: 'signin',
          usePopup: true,
        });
        setReady(true);
      })
      .catch(() => {
        // Blocked or offline: the icon stays inactive.
      });
    return () => {
      cancelled = true;
    };
  }, [active, clientId]);

  const handleClick = useCallback(async () => {
    const AppleID = (window as unknown as { AppleID?: AppleID }).AppleID;
    if (!AppleID || busy) return;

    let idToken: string | undefined;
    try {
      const res = await AppleID.auth.signIn();
      idToken = res.authorization?.id_token;
    } catch {
      // Apple rejects when the popup is closed (popup_closed_by_user) or the
      // person cancels. Neither is an error worth shouting about.
      return;
    }
    if (!idToken) return;

    setBusy(true);
    onLoadingChange?.(true);
    try {
      await loginWithApple(idToken);
      toast('Login successful!', 'success');
      onSuccess?.();
      router.push('/');
    } catch (e: any) {
      toast(e?.response?.data?.message || 'Apple sign-in failed. Please try again.', 'error');
    } finally {
      setBusy(false);
      onLoadingChange?.(false);
    }
  }, [busy, loginWithApple, onLoadingChange, onSuccess, router, toast]);

  return <AppleIcon onClick={clientId && ready ? handleClick : undefined} busy={busy} />;
}
