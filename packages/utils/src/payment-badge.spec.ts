import { describe, expect, it } from 'vitest';
import { paymentBadge } from './payment-badge';

describe('paymentBadge', () => {
  it('shows an abandoned online payment as such, not PENDING', () => {
    expect(paymentBadge({ paymentState: 'ABANDONED_AT_PAYMENT', paymentStatus: 'PENDING' })).toEqual({
      label: 'ABANDONED AT PAYMENT',
      variant: 'orange',
    });
  });

  it('shows a live unpaid online checkout as awaiting payment', () => {
    expect(paymentBadge({ paymentState: 'AWAITING_PAYMENT', paymentStatus: 'PENDING' })).toEqual({
      label: 'AWAITING PAYMENT',
      variant: 'info',
    });
  });

  it('prefers paymentState over paymentStatus', () => {
    expect(paymentBadge({ paymentState: 'SUCCESS', paymentStatus: 'PENDING' }).label).toBe('PAID');
  });

  it('falls back to paymentStatus when the API sent no paymentState', () => {
    expect(paymentBadge({ paymentStatus: 'PENDING' })).toEqual({ label: 'PENDING', variant: 'warning' });
    expect(paymentBadge({ paymentState: null, paymentStatus: 'PENDING' })).toEqual({ label: 'PENDING', variant: 'warning' });
  });

  it('keeps the existing labels for settled and part-settled orders', () => {
    expect(paymentBadge({ paymentStatus: 'SUCCESS' })).toEqual({ label: 'PAID', variant: 'success' });
    expect(paymentBadge({ paymentStatus: 'PAID' })).toEqual({ label: 'PAID', variant: 'success' });
    expect(paymentBadge({ paymentStatus: 'PARTIAL' })).toEqual({ label: 'PARTIAL', variant: 'warning' });
  });

  it('renders a failed or unknown status as an error, and a missing one as a dash', () => {
    expect(paymentBadge({ paymentStatus: 'FAILED' })).toEqual({ label: 'FAILED', variant: 'error' });
    expect(paymentBadge({ paymentStatus: 'SOMETHING_NEW' })).toEqual({ label: 'SOMETHING_NEW', variant: 'error' });
    expect(paymentBadge({})).toEqual({ label: '—', variant: 'error' });
  });
});
