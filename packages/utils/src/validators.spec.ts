import { describe, it, expect } from 'vitest';
import { productFormSchema } from './validators';

/**
 * The box condition is mandatory for sellers, and for now this schema is the
 * ONLY thing enforcing it.
 *
 * The database column is nullable on purpose, and the API's create DTO accepts
 * a missing value while the seller form and the API deploy separately. So if
 * this rule is ever weakened, a listing can be created with no answer and the
 * product page silently shows no tag, with nothing anywhere to object.
 */

/** A form that is valid apart from the field under test. */
const baseForm = {
  product_name: 'Luffy & Shanks Figure',
  product_price: 620,
  company_name: 'Banpresto',
  categories: ['cat-1'],
  sub_categories: ['sub-1'],
};

const errorPaths = (input: unknown): string[] => {
  const result = productFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
};

describe('productFormSchema box_condition', () => {
  it('rejects a form with no box_condition', () => {
    expect(errorPaths({ ...baseForm })).toContain('box_condition');
  });

  it('rejects a value outside the two allowed options', () => {
    expect(errorPaths({ ...baseForm, box_condition: 'MAYBE' })).toContain(
      'box_condition',
    );
  });

  it('rejects an empty string, which is what an untouched radio group sends', () => {
    expect(errorPaths({ ...baseForm, box_condition: '' })).toContain(
      'box_condition',
    );
  });

  it('accepts WITH_BOX', () => {
    expect(errorPaths({ ...baseForm, box_condition: 'WITH_BOX' })).not.toContain(
      'box_condition',
    );
  });

  it('accepts WITHOUT_BOX', () => {
    expect(
      errorPaths({ ...baseForm, box_condition: 'WITHOUT_BOX' }),
    ).not.toContain('box_condition');
  });

  it('does not disturb the rest of the schema', () => {
    // A form missing an unrelated required field must still fail on that
    // field, not silently pass because box_condition is now present.
    const paths = errorPaths({ ...baseForm, box_condition: 'WITH_BOX', product_name: 'x' });
    expect(paths).toContain('product_name');
  });
});

/**
 * A pre-order listing has no tracked stock at all — the promised delivery date
 * IS the flag — so the three rules written for tracked stock would otherwise
 * block every one of them.
 */

/** A listing that parses cleanly, so a failure below is the field under test. */
const completeForm = {
  ...baseForm,
  box_condition: 'WITH_BOX',
  stock: 10,
  min_order_qty: 1,
  max_order_qty: 5,
  custom_extra_fields: [],
};

const DAY = 24 * 60 * 60 * 1000;
const future = () => new Date(Date.now() + 30 * DAY).toISOString();
const past = () => new Date(Date.now() - 30 * DAY).toISOString();
const longerAgo = () => new Date(Date.now() - 90 * DAY).toISOString();

describe('productFormSchema — pre-order listings', () => {
  it('has a base form that parses, so the cases below mean something', () => {
    expect(errorPaths(completeForm)).toEqual([]);
  });

  it('still rejects zero stock on an ordinary listing', () => {
    const paths = errorPaths({ ...completeForm, stock: 0 });
    expect(paths).toContain('stock');
    expect(paths).toContain('min_order_qty');
  });

  it('accepts zero stock once the listing is a pre-order', () => {
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_delivery_date: future(),
    });
    expect(paths).toEqual([]);
  });

  it('demands a delivery date when pre-order is switched on', () => {
    const paths = errorPaths({ ...completeForm, stock: 0, is_pre_order: true });
    expect(paths).toContain('pre_order_delivery_date');
  });

  it('rejects a past date the seller has just entered', () => {
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_delivery_date: past(),
    });
    expect(paths).toContain('pre_order_delivery_date');
  });

  it('accepts an unchanged past date, so an old listing stays editable', () => {
    // A seller fixing the price of a pre-order whose promised date has gone by
    // must still be able to save. Nothing unpublishes a listing automatically,
    // so a past date is a legitimate stored state and validation may not
    // strand a listing that is in one.
    const stored = past();
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_delivery_date: stored,
      pre_order_original_date: stored,
    });
    expect(paths).toEqual([]);
  });

  it('compares the two dates as STRINGS, so the form must normalize both', () => {
    // Documenting a sharp edge rather than endorsing it. These two spellings
    // are the same instant, and the second is still rejected — so the
    // no-lockout behaviour above holds only while the form populates
    // pre_order_original_date from the same normalized string as
    // pre_order_delivery_date. A full ISO original against a YYYY-MM-DD
    // `<input type="date">` value locks the seller out of an expired
    // pre-order with a message about a date they never touched.
    const rejected = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_delivery_date: '2020-01-15T00:00:00.000Z',
      pre_order_original_date: '2020-01-15T00:00:00Z',
    });
    expect(rejected).toContain('pre_order_delivery_date');

    const accepted = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_delivery_date: '2020-01-15T00:00:00.000Z',
      pre_order_original_date: '2020-01-15T00:00:00.000Z',
    });
    expect(accepted).toEqual([]);
  });

  it('rejects moving a stored past date to a different past date', () => {
    // Editing a date is a fresh promise, and it may not be a promise about
    // a day that has already gone.
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_original_date: longerAgo(),
      pre_order_delivery_date: past(),
    });
    expect(paths).toContain('pre_order_delivery_date');
  });

  it('accepts moving a stored past date forward into the future', () => {
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      is_pre_order: true,
      pre_order_original_date: past(),
      pre_order_delivery_date: future(),
    });
    expect(paths).toEqual([]);
  });

  it('ignores the date rules entirely when pre-order is off', () => {
    // A listing that once was a pre-order, switched back to tracked stock,
    // may still be carrying the old date in the form state.
    const paths = errorPaths({
      ...completeForm,
      is_pre_order: false,
      pre_order_delivery_date: past(),
    });
    expect(paths).toEqual([]);
  });

  it('keeps the stock rules for a listing that is not a pre-order', () => {
    // The bypass must key off the flag, not off the presence of a date.
    const paths = errorPaths({
      ...completeForm,
      stock: 0,
      pre_order_delivery_date: future(),
    });
    expect(paths).toContain('stock');
  });
});
