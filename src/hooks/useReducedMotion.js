import { useState, useEffect } from 'react';

/**
 * Returns `true` when the OS / browser has `prefers-reduced-motion: reduce`
 * enabled. Subscribes to live changes so the UI adapts immediately when
 * the user toggles the accessibility setting without a reload.
 *
 * Usage:
 *   const reducedMotion = useReducedMotion();
 *   if (reducedMotion) { /* skip / simplify animation *\/ }
 */
export function useReducedMotion() {
  // Initialise synchronously to avoid a one-frame flash of full animation
  // on first render for users that have the setting enabled.
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e) => setPrefersReduced(e.matches);

    // addEventListener / removeEventListener (modern API)
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
