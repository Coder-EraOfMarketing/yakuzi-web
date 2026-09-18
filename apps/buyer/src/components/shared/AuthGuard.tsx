'use client';

import { useAuth } from '@yukizi/api-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

/**
 * Gates a page on being LOGGED IN. Nothing more.
 *
 * It used to gate on being logged in AND "verified", where verified meant an
 * admin had approved a KYC submission carrying a GST number, a PAN and a
 * legal business name. That is PharmaBag's B2B flow — its buyers are
 * pharmacies that must prove a drug licence before they can order — and it
 * came across with the fork. On a consumer store selling anime figures it was
 * asking every shopper for a GST number they do not have, then holding them
 * in a pending state until somebody approved them by hand.
 *
 * Two behaviours were removed here:
 *
 *  1. A redirect that sent any logged-in-but-unverified buyer to /onboarding
 *     from anywhere outside a small allow-list. That is what made the KYC
 *     wall inescapable rather than merely present on checkout.
 *  2. A 10-second polling loop that re-fetched the profile waiting for an
 *     admin to approve the account, plus the "Your account has been
 *     verified!" toast it fired. With no approval step left there is nothing
 *     to poll for, and removing it also stops a background request every ten
 *     seconds on every authenticated page.
 *
 * Deliberately UNCHANGED, because none of it is about KYC:
 *  - the login redirect and the `open-login` event for anonymous visitors
 *  - the "login modal dismissed" fallback back to the homepage
 *  - the loading state
 *  - the API's block on BLOCKED accounts, which is a moderation ban and
 *    still enforced server-side in the JWT strategy
 *
 * Seller verification is untouched and lives in a different app entirely.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowRedirect(true);
      const timeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-login'));
      }, 1500);
      return () => clearTimeout(timeout);
    }

    if (!isLoading && isAuthenticated) {
      setShowRedirect(false);
    }
  }, [isLoading, isAuthenticated]);

  // If the user cancels the login modal (X, backdrop click) instead of logging
  // in, don't leave them stranded on the "redirecting to login" placeholder —
  // send them back to the homepage so they can keep browsing.
  useEffect(() => {
    const handleDismissed = () => {
      if (!isAuthenticated) router.push('/');
    };
    window.addEventListener('login-modal-closed', handleDismissed);
    return () => window.removeEventListener('login-modal-closed', handleDismissed);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2fcf6]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (showRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2fcf6]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          < Shield className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-gray-600 font-medium">Please log in to continue</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
