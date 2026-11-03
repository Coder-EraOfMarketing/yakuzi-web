/**
 * The courier stages that cannot be observed for a self-ship order: the seller
 * books their own courier, so nothing reports "picked up" or "out for
 * delivery" back to Yukizi. Such an order goes Placed -> Accepted (the seller
 * pasting a tracking link accepts it) -> Delivered, marked by hand.
 */
export const SELF_SHIP_UNTRACKED_STEPS: readonly string[] = [
  'READY_TO_SHIP',
  'DISPATCHED_FROM_SELLER',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
];

/**
 * Only orders at PLACED/ACCEPTED (taking the shortcut) or DELIVERED (finished,
 * and those stages were never tracked) show the stages as untracked. A
 * self-ship order sitting in the courier stages (they used to jump straight to
 * SHIPPED on the first tracking link) keeps the ordinary stepper, so it can
 * still be walked forward from where it is.
 */
const skipsCourierStages = (currentKey: string, selfShip: boolean): boolean =>
  selfShip && (currentKey === 'PLACED' || currentKey === 'ACCEPTED' || currentKey === 'DELIVERED');

export function isUntrackedStep(stepKey: string, currentKey: string, selfShip: boolean): boolean {
  return skipsCourierStages(currentKey, selfShip) && SELF_SHIP_UNTRACKED_STEPS.includes(stepKey);
}

/** The step a "Click to advance" should move to, or null when there is none. */
export function nextStepKey(stepKeys: readonly string[], currentKey: string, selfShip: boolean): string | null {
  const idx = stepKeys.indexOf(currentKey);
  if (idx === -1) return null;
  for (let i = idx + 1; i < stepKeys.length; i++) {
    if (!isUntrackedStep(stepKeys[i], currentKey, selfShip)) return stepKeys[i];
  }
  return null;
}
