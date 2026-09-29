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
