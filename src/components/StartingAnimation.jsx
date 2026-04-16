import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── OPTIMIZATION: Static arrays and strings extracted to avoid re-allocation ──
const BRAND_TEXT = ['I', 'C', 'E', '\u00A0', 'T', 'E', 'C', 'H'];
const NOISE_BG = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

const StartingAnimation = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
  // ── OPTIMIZATION: Stabilize onComplete to prevent effect re-runs if parent passes inline function ──
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // ── OPTIMIZATION: useGSAP provides automatic context cleanup and React 18 Strict Mode compatibility ──
  useGSAP(() => {
    if (reducedMotion) {
      document.body.style.overflow = '';
      onCompleteRef.current?.();
      return;
    }

    document.body.style.overflow = 'hidden';
    let isMounted = true;

    // Entrance Animation - automatically cleaned up by useGSAP context
    const entranceTl = gsap.timeline();
    
    // We use standard GSAP selectors inside useGSAP context scope
    entranceTl
      .set('.panel', { yPercent: 0 })
      .fromTo('.brand-char', 
        { yPercent: 120, rotation: 10, opacity: 0 }, 
        { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out', delay: 0.3 }
      )
      .fromTo('.glow-line',
        { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 1, ease: 'power3.inOut' },
        "-=0.8"
      )
      .fromTo('.subtitle-text',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.6"
      );

    let isReady = false;
    let minTimeElapsed = false;
    let exitTl;
    
    const finishSequence = () => {
      if (!isMounted) return;
      
      exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (isMounted) onCompleteRef.current?.();
        }
      });

      exitTl
        .to('.subtitle-text', { y: -20, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
        .to('.glow-line', { scaleX: 0, duration: 0.5, ease: 'power3.inOut' }, 0.1)
        .to('.brand-char', 
          { yPercent: -120, rotation: -5, opacity: 0, duration: 0.6, stagger: 0.03, ease: 'power3.in' }, 
          0.1
        )
        .to('.panel-top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 0.6)
        .to('.panel-bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 0.6);
    };

    const minTimeDelay = setTimeout(() => {
      minTimeElapsed = true;
      if (isReady) finishSequence();
    }, 12000); // 12 seconds to ensure 120 frames load on 4Mbps connection

    const handleReady = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          isReady = true;
          if (minTimeElapsed) finishSequence();
        }).catch(() => {
          isReady = true;
          if (minTimeElapsed) finishSequence();
        });
      } else {
        isReady = true;
        if (minTimeElapsed) finishSequence();
      }
    };

    if (document.readyState === 'complete') {
      handleReady();
    } else {
      window.addEventListener('load', handleReady);
    }

    const fallbackTimeout = setTimeout(() => {
      isReady = true;
      if (minTimeElapsed) finishSequence();
    }, 6000);

    return () => {
      isMounted = false;
      window.removeEventListener('load', handleReady);
      clearTimeout(minTimeDelay);
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = '';
      if (exitTl) exitTl.kill(); // The context kills entranceTl automatically, but we ensure exitTl is caught if triggered late.
    };
  }, { scope: containerRef, dependencies: [reducedMotion] }); // Dependencies ensure effect only re-runs if reducedMotion changes

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[9999] pointer-events-auto overflow-hidden bg-transparent"
    >
      <div 
        className="panel panel-top absolute top-0 left-0 w-full h-1/2 bg-[#0D1A1A] will-change-transform"
      ></div>
      <div 
        className="panel panel-bottom absolute bottom-0 left-0 w-full h-1/2 bg-[#0D1A1A] will-change-transform"
      ></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4">
        <div className="overflow-hidden pb-4">
          <div className="flex justify-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-[0.1em] origin-center leading-none">
            {BRAND_TEXT.map((char, i) => (
              <span key={i} className="brand-char inline-block will-change-transform mt-2">{char}</span>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center h-[2px] mt-2 mb-6">
          <div className="glow-line w-64 sm:w-96 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f2fe]/80 to-transparent"></div>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="subtitle-text text-[#00f2fe]/60 uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[10px] sm:text-xs font-light px-4 text-center"
          >
            Premium Artisanal Taste
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE_BG }}></div>
    </div>
  );
};

export default StartingAnimation;
