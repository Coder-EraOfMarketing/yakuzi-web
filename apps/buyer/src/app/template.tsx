'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Set once the first page of this browser session has hydrated; module scope so
 * it survives client-side navigations (a template is re-instantiated on every
 * route change, so component state cannot carry it).
 *
 * On the SERVER it never becomes true — effects do not run there — so every
 * server render is the "first load" shape, which is exactly right.
 */
let hasHydrated = false;

/**
 * Fades each client-side navigation in.
 *
 * This used to render `<div>` on the first pass and swap to `<motion.div
 * initial={{opacity: 0}}>` after mount, so the fade would play. But those are
 * two different component types at the same position, so React did not update
 * the tree, it DESTROYED and REBUILT it: every page, on every load, was mounted
 * twice, about a second apart. Visible symptoms were a flash as the finished
 * page vanished and faded back from opacity 0, the homepage banner video
 * restarting from its empty first frame (and, on a phone, re-requesting its
 * file), every image and effect running twice, and analytics effects firing
 * twice.
 *
 * Now there is ONE stable element for the life of the page:
 *  - the first load (server render + hydration) uses `initial={false}`: it is
 *    painted in its final state, with no opacity:0 in the HTML and no remount;
 *  - later client-side navigations mount a fresh template with the fade-in
 *    applied from the very first render, so they animate without any swap.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  // Read during render, written in an effect: this render is the one that
  // decides, so it sees the value from BEFORE this page hydrated.
  const animateIn = hasHydrated;

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 10, scale: 0.99 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
