import { redirect } from 'next/navigation';

/**
 * An order has one place it is read: the drawer on /orders.
 *
 * This route used to render a second, separate order page, reached only by
 * coming back from the tax invoice or by finishing a payment. It was built
 * against an older response shape, so it showed the order stripped of its
 * product names and pictures — the same order looked broken here and fine in
 * the drawer. Rather than keep two order screens in step, everything lands on
 * the drawer, and this address keeps working for anything already pointing at
 * it: a bookmark, a back button, an old link.
 */
export default function OrderByIdPage({
  params,
}: {
  params: { orderId: string };
}) {
  redirect(`/orders?drawer=${params.orderId}`);
}
