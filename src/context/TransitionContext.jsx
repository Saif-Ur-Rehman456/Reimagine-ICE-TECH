import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef(null);
  const columnRefs = useRef([]);
  const activeTlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (activeTlRef.current) activeTlRef.current.kill();
    };
  }, []);

  const playTransition = useCallback((callback) => {
    if (isTransitioningRef.current) return;
    
    if (reducedMotion) {
      if (callback) callback();
      return;
    }

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const tl = gsap.timeline();
    activeTlRef.current = tl;

    // Force immediate visibility and reset positions
    gsap.set(overlayRef.current, { autoAlpha: 1, visibility: 'visible' });
    gsap.set(columnRefs.current, { xPercent: -100, yPercent: 0 });

    // Slide in from left to cover screen
    tl.to(columnRefs.current, {
      xPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.inOut',
      onComplete: () => {
        // Navigation happens while screen is covered
        if (callback) callback();
        
        // Slide out to the right
        const outTl = gsap.timeline();
        activeTlRef.current = outTl;
        
        outTl.to(columnRefs.current, {
          xPercent: 100,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.inOut',
          onComplete: () => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
            gsap.set(overlayRef.current, { autoAlpha: 0 });
            // Reset for next time
            gsap.set(columnRefs.current, { xPercent: -100 });
            activeTlRef.current = null;
          }
        });
      }
    });
  }, [reducedMotion]);

  return (
    <TransitionContext.Provider value={{ playTransition, isTransitioning, columnRefs, overlayRef }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => useContext(TransitionContext);
