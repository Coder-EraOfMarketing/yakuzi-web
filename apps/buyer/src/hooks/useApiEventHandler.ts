'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onApiEvent } from '@yukizi/api-client';
import { useToast } from '@/components/shared/Toast';
import { localCart } from '@/lib/local-cart';
import { useQueryClient } from '@tanstack/react-query';
import { clearTokens } from '@yukizi/api-client';

/**
 * Subscribes to global API events and shows toast notifications / handles redirects.
 * Mount this once in the app layout.
 */
export function useApiEventHandler() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubs = [
      onApiEvent('auth:expired', (detail) => {
        // Clear cart, token and redirect
        localCart.clear();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        
        if (typeof window !== 'undefined') {
          // clearTokens() removes the current keys AND every legacy `pb_*`
          // name, so a stale copy cannot resurrect a session after logout.
          clearTokens();
        }
      }),
      onApiEvent('error:forbidden', (detail) => {
        toast(detail?.message || 'You do not have permission to perform this action.', 'error');
      }),
      onApiEvent('error:server', (detail) => {
        toast(detail?.message || 'Something went wrong. Please try again.', 'error');
      }),
      onApiEvent('error:network', (detail) => {
        toast(detail?.message || 'Network error. Please check your connection.', 'error');
      }),
    ];

    return () => unsubs.forEach(fn => fn());
  }, [toast, router]);
}
