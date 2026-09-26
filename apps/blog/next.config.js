/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'yukizi03.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
  // This app duplicates the buyer app's /blogs pages (same posts, same API) but
  // carries none of their SEO: no canonicals, no per-post metadata, no sitemap.
  // The buyer app at yukizi.com/blogs is the canonical blog — admin links there,
  // and its posts have BlogPosting schema and sitemap entries. If this app is
  // ever reachable on a public hostname it must not compete with or dilute
  // those pages, so every response is stamped noindex at the header level
  // (covers images and any non-HTML responses the <meta> tag can't).
  // robots.txt deliberately does NOT Disallow: a crawler must be able to fetch
  // the page to see the noindex — blocking the crawl would leave the URL
  // eligible for reference-only indexing if anything links to it.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
