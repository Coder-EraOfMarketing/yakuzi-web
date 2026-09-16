import Link from 'next/link';
import Image from 'next/image';

/**
 * Server-rendered product grid for the collection hub pages.
 *
 * Deliberately NOT ProductCarousel: that component calls useSearchParams()
 * (line ~541), and on a STATIC route that forces a bailout to client-side
 * rendering — the entire grid vanished from the served HTML behind a
 * BAILOUT_TO_CLIENT_SIDE_RENDERING marker, which on an SEO landing page is
 * the whole product gone (observed live on every hub, 2026-09-16). A plain
 * server component cannot bail out, so every card and link below is
 * guaranteed to be in the HTML crawlers fetch.
 */

function imageUrlOf(p: any): string | null {
  if (typeof p.image === 'string' && p.image) return p.image;
  const first = Array.isArray(p.images) ? p.images[0] : null;
  if (typeof first === 'string') return first;
  if (first && typeof first.url === 'string') return first.url;
  return null;
}

function formatINR(value: unknown): string | null {
  const n = typeof value === 'string' ? Number(value) : (value as number);
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return null;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export default function CollectionGrid({ products }: { products: any[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 px-4 pb-4 pt-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p) => {
        const img = imageUrlOf(p);
        const price = formatINR(p.price ?? p.mrp);
        return (
          <li key={p.id}>
            <Link
              href={`/products/${p.slug ?? p.id}`}
              className="group block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-[160px] w-full bg-gray-50 sm:h-[200px]">
                {img ? (
                  <Image
                    src={img}
                    alt={`${p.name ?? 'Product'} - Yukizi`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-bold text-gray-300">
                    {(p.name ?? '?').slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 p-3">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-[#854cbc]">
                  {p.name}
                </h3>
                {price && <p className="text-sm font-semibold text-gray-900">{price}</p>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
