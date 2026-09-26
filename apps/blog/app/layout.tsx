import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Yukizi Blog | Anime, Manga & Collectibles",
  description: "Guides, news and stories from the world of anime, manga and collectibles — from the Yukizi team.",
  // The canonical blog lives on the buyer app at yukizi.com/blogs (per-post
  // metadata, BlogPosting schema, sitemap). This app serves the same posts
  // with none of that, so it must never be indexed — see next.config.js,
  // which also sets X-Robots-Tag on every response.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
