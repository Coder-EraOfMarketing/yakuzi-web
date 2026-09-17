import { AUTHENTICITY_GUIDES } from './authenticity';
import { INDIA_GUIDES } from './india';
import { FORMAT_GUIDES } from './formats';
import { OWNERSHIP_GUIDES } from './ownership';
import {
  GUIDE_CATEGORY_LABEL,
  GUIDE_CATEGORY_BLURB,
  type GuideCategory,
  type GuideDef,
} from './types';

export * from './types';

export const GUIDES: GuideDef[] = [
  ...AUTHENTICITY_GUIDES,
  ...INDIA_GUIDES,
  ...FORMAT_GUIDES,
  ...OWNERSHIP_GUIDES,
];

/**
 * Slug uniqueness is checked at module load, not left to review.
 *
 * Guides live in four separate files by category, which is what keeps each
 * file readable — and also the exact condition under which two authors add
 * the same slug in different files without noticing. A duplicate would make
 * `guideBySlug` silently return whichever came first while the sitemap listed
 * the URL once, so one guide would become unreachable with no error anywhere.
 * Failing the build is much cheaper than finding that in Search Console.
 */
const seen = new Set<string>();
for (const g of GUIDES) {
  if (seen.has(g.slug)) {
    throw new Error(
      `[seo/guides] duplicate guide slug "${g.slug}" — slugs must be unique across every file in data/guides/`,
    );
  }
  seen.add(g.slug);
}

export function guideBySlug(slug: string): GuideDef | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  'authenticity',
  'india',
  'formats',
  'ownership',
];

export function guidesByCategory(category: GuideCategory): GuideDef[] {
  return GUIDES.filter((g) => g.category === category);
}

/**
 * Resolves `relatedGuides` slugs to definitions, dropping anything unknown.
 *
 * Dropping rather than throwing is deliberate here, unlike the duplicate
 * check above: a stale cross-reference should cost one link, not the build.
 * The pages this points at are internal links, and a missing one degrades to
 * a shorter list — whereas a typo in a related-guide slug taking the whole
 * site down would be a wildly disproportionate failure.
 */
export function relatedGuidesOf(guide: GuideDef): GuideDef[] {
  return (guide.relatedGuides ?? [])
    .map((slug) => guideBySlug(slug))
    .filter((g): g is GuideDef => !!g && g.slug !== guide.slug);
}

export { GUIDE_CATEGORY_LABEL, GUIDE_CATEGORY_BLURB };
