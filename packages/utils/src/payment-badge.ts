export type PaymentBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'orange';

export interface PaymentBadge {
  label: string;
  variant: PaymentBadgeVariant;
}

/**
 * Label and colour for an order's payment cell.
 *
 * `paymentState` is the API's derived value (AWAITING_PAYMENT /
 * ABANDONED_AT_PAYMENT on top of the stored status). It is absent on older API
 * deploys and on endpoints that don't compute it, in which case this falls back
 * to the stored `paymentStatus`, exactly as the screens always rendered it.
 *
 * Abandoned is orange, not red: it is a lost sale to follow up, not a payment
 * that failed on the buyer.
 */
export function paymentBadge(order: { paymentState?: string | null; paymentStatus?: string | null }): PaymentBadge {
  const state = order.paymentState ?? order.paymentStatus;

  switch (state) {
    case 'SUCCESS':
    case 'PAID':
      return { label: 'PAID', variant: 'success' };
    case 'PARTIAL':
      return { label: 'PARTIAL', variant: 'warning' };
    case 'PENDING':
      return { label: 'PENDING', variant: 'warning' };
    case 'AWAITING_PAYMENT':
      return { label: 'AWAITING PAYMENT', variant: 'info' };
    case 'ABANDONED_AT_PAYMENT':
      return { label: 'ABANDONED AT PAYMENT', variant: 'orange' };
    default:
      return { label: state ?? '—', variant: 'error' };
  }
}
