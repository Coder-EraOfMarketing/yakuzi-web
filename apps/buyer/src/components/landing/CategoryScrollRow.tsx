'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { HomepageSection } from '@yukizi/api-client';
import { GridProductCard } from './ProductCarousel';
import QuickReviewModal from './QuickReviewModal';

export default function CategoryScrollRow({ section }: { section: HomepageSection }) {
  const [reviewProduct, setReviewProduct] = useState<any | null>(null);

  // The API already omits sections with zero products (findAllPublic filters
  // them server-side) — this is defense-in-depth against a contract violation,
  // not the primary guard against an empty row rendering.
  if (!section.products?.length) return null;

  const categorySlug = section.category?.slug ?? section.subCategory?.categorySlug;

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-none mx-auto mb-8 sm:mb-12">
      <div className="px-4 sm:px-8 mb-3">
        <h2 className="text-base sm:text-xl font-semibold text-[#333333]">
          {/* The title AND the arrow are one link, side by side. Before, only a
              small arrow pinned to the far right edge was clickable, so tapping
              the heading itself — the obvious thing to tap — did nothing.
              The link sits inside the h2 so the heading keeps its semantics and
              crawlers see a heading that links to the category page. */}
          {categorySlug ? (
            <Link
              href={`/category/${categorySlug}`}
              className="group inline-flex items-center gap-1 rounded-md hover:text-[#7B2FBE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B2FBE] transition-colors"
              aria-label={`View all products in ${section.title}`}
            >
              <span>{section.title}</span>
              <ChevronRight
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-[#7B2FBE] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : (
            // A section with no category to point at stays a plain heading
            // rather than linking to /category/undefined.
            section.title
          )}
        </h2>
      </div>

      {/* scroll-pl-* must match px-*: scroll snapping aligns a snap-start item
          with the edge of the SCROLLPORT, which ignores padding. Without it the
          row rests at scrollLeft:16, cancelling its own left padding, and the
          first card sits flush against the screen edge while the section
          heading above it is indented 16px. */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 px-4 sm:px-8 scroll-pl-4 sm:scroll-pl-8 pb-1 scrollbar-hide">
        {section.products.map((product, index) => (
          // 200px on mobile (was 150px) - the card's own internal max-w-[210px]
          // cap (ProductCarousel.tsx) already allows this width, so this is a
          // self-contained change to this row only: no other GridProductCard
          // consumer (the category-page grid, product-detail related items)
          // is affected, since none of them read this wrapper's width.
          <div key={`${product?.id || 'prod'}-${index}`} className="snap-start shrink-0 w-[200px] sm:w-[210px]">
            <GridProductCard product={product} index={index} onOpenReview={setReviewProduct} />
          </div>
        ))}
      </div>

      {reviewProduct && (
        <QuickReviewModal
          isOpen={!!reviewProduct}
          onClose={() => setReviewProduct(null)}
          product={reviewProduct}
        />
      )}
    </div>
  );
}
