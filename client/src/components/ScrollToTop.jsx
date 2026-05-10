import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Disable browser scroll restoration once at module load — before React renders.
// Without this, the browser tries to restore the previous scroll position on
// back/forward navigation, fighting our manual reset.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // useLayoutEffect fires synchronously after DOM mutations but before paint.
  // This ensures the page is at y=0 before Framer Motion's enter animation
  // begins — no flash of old scroll position.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;