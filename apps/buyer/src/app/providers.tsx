'use client';

import { useEffect, useState } from 'react';
import { ReactQueryProvider } from '@/lib/react-query-provider';
import { AuthProvider } from '@yukizi/api-client';
import { ToastProvider } from '@/components/shared/Toast';
import { useApiEventHandler } from '@/hooks/useApiEventHandler';
import dynamic from 'next/dynamic';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

// The login modal renders nothing until something opens it, so its code
// (761 lines + Google Identity wiring) is loaded on demand instead of in the
// first-load bundle of every page. `loading: null` matches a closed modal.
const LoginModal = dynamic(() => import('@/components/landing/LoginModal'), {
  ssr: false,
  loading: () => null,
});

function ApiEventBridge({ children }: { children: React.ReactNode }) {
  useApiEventHandler();
  return <>{children}</>;
}

// Owns the modal's open state so the 'open-login' listener registers at
// hydration, exactly as it did when LoginModal was in the first-load bundle.
// The lazily-loaded modal itself can arrive a beat later without dropping an
// early dispatch (AuthGuard fires 'open-login' on page load for guarded
// pages) — the open STATE waits for it, an event listener would not.
function LazyLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-login', handleOpen);
    return () => window.removeEventListener('open-login', handleOpen);
  }, []);
  return <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider baseURL={process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL}>
        <ToastProvider>
          <ApiEventBridge>{children}</ApiEventBridge>
          <LazyLoginModal />
          <AnalyticsProvider />
        </ToastProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
