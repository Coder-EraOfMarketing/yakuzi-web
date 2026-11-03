import { describe, expect, it } from 'vitest';
import { isUntrackedStep, nextStepKey } from './order-stepper';

const STEPS = ['PLACED', 'ACCEPTED', 'READY_TO_SHIP', 'DISPATCHED_FROM_SELLER', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

describe('nextStepKey', () => {
  it('walks a Shiprocket order one stage at a time', () => {
    expect(nextStepKey(STEPS, 'PLACED', false)).toBe('ACCEPTED');
    expect(nextStepKey(STEPS, 'ACCEPTED', false)).toBe('READY_TO_SHIP');
    expect(nextStepKey(STEPS, 'SHIPPED', false)).toBe('OUT_FOR_DELIVERY');
  });

  it('takes a self-ship order from Accepted straight to Delivered', () => {
    expect(nextStepKey(STEPS, 'PLACED', true)).toBe('ACCEPTED');
    expect(nextStepKey(STEPS, 'ACCEPTED', true)).toBe('DELIVERED');
  });

  it('keeps the ordinary walk for a self-ship order already in the courier stages', () => {
    expect(nextStepKey(STEPS, 'SHIPPED', true)).toBe('OUT_FOR_DELIVERY');
    expect(nextStepKey(STEPS, 'READY_TO_SHIP', true)).toBe('DISPATCHED_FROM_SELLER');
  });

  it('has no next step at the end or for an unknown status', () => {
    expect(nextStepKey(STEPS, 'DELIVERED', true)).toBeNull();
    expect(nextStepKey(STEPS, 'DELIVERED', false)).toBeNull();
    expect(nextStepKey(STEPS, 'RETURNED', true)).toBeNull();
  });
});

describe('isUntrackedStep', () => {
  it('greys the four courier stages for a self-ship order at Placed or Accepted', () => {
    for (const current of ['PLACED', 'ACCEPTED']) {
      for (const step of ['READY_TO_SHIP', 'DISPATCHED_FROM_SELLER', 'SHIPPED', 'OUT_FOR_DELIVERY']) {
        expect(isUntrackedStep(step, current, true)).toBe(true);
      }
      expect(isUntrackedStep('DELIVERED', current, true)).toBe(false);
      expect(isUntrackedStep('ACCEPTED', current, true)).toBe(false);
    }
  });

  it('never greys anything for a Shiprocket order', () => {
    expect(isUntrackedStep('SHIPPED', 'ACCEPTED', false)).toBe(false);
  });

  it('never greys a stage on a self-ship order that is sitting in the courier stages', () => {
    expect(isUntrackedStep('SHIPPED', 'SHIPPED', true)).toBe(false);
    expect(isUntrackedStep('OUT_FOR_DELIVERY', 'SHIPPED', true)).toBe(false);
  });

  it('keeps them greyed once a self-ship order is delivered: they were never tracked', () => {
    expect(isUntrackedStep('OUT_FOR_DELIVERY', 'DELIVERED', true)).toBe(true);
    expect(isUntrackedStep('DELIVERED', 'DELIVERED', true)).toBe(false);
    expect(isUntrackedStep('OUT_FOR_DELIVERY', 'DELIVERED', false)).toBe(false);
  });
});
