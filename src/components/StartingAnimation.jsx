import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

const StartingAnimation = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const columnRefs = useRef([]);
  const progressBarRef = useRef(null);
  const statusRef = useRef(null);
  const progressObjRef = useRef({ value: 0 });
  // ── STEP 1: Track exit timeline so we can kill it on unmount ──
  const exitTlRef = useRef(null);

  useEffect(() => {
    // ── STEP 3: prefers-reduced-motion bypass ──
    // Instantly complete without any animation to respect vestibular disorders.
    if (reducedMotion) {
      document.body.style.overflow = '';
      onComplete?.();
      return;
    }

    document.body.style.overflow = 'hidden';

    // ── STEP 1: isMounted flag prevents async callbacks touching unmounted state ──
    let isMounted = true;

    const updateProgressUI = () => {
      if (!isMounted) return;
      const value = Math.floor(progressObjRef.current.value);
      setProgress(value);
      if (progressBarRef.current) progressBarRef.current.style.width = `${value}%`;
      
      if (statusRef.current) {
        if (value < 30) statusRef.current.textContent = 'INITIALIZING...';
        else if (value < 70) statusRef.current.textContent = 'LOADING ASSETS...';
        else if (value < 95) statusRef.current.textContent = 'RENDERING...';
        else statusRef.current.textContent = 'COMPLETED!';
      }
    };

    const finishSequence = () => {
      if (!isMounted) return;
      
      // ── Store exit tl in ref so cleanup can kill it ──
      exitTlRef.current = gsap.timeline({
        onComplete: () => {
          // Always restore overflow — even if React unmounts first
          document.body.style.overflow = '';
          if (isMounted && onComplete) onComplete();
        }
      });

      exitTlRef.current
        .to(contentRef.current, {
          scale: 0.9,
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: 'power2.out'
        }, 0)
        .to(columnRefs.current, {
          yPercent: -100,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.inOut'
        }, 0.2);
    };

    const completeLoading = () => {
      if (!isMounted) return;
      gsap.to(progressObjRef.current, {
        value: 100,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: updateProgressUI,
        onComplete: finishSequence
      });
    };

    // 1. Start an initial fake progress up to 85% to give the illusion of background activity
    const initialTween = gsap.to(progressObjRef.current, {
      value: 85,
      // Fake progress duration - fast to give user immediate feedback
      duration: 0.8, 
      ease: 'power1.inOut',
      onUpdate: updateProgressUI,
    });

    // 2. Logic to detect when actual page assets are ready
    let fallbackTimeout;
    
    const handleReady = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(completeLoading).catch(completeLoading);
      } else {
        completeLoading();
      }
    };

    const runDynamicLoading = () => {
      if (document.readyState === 'complete') {
        handleReady();
      } else {
        window.addEventListener('load', handleReady);
      }

      // Safety fallback: Never keep the user waiting more than 1.2s total load time (Very fast Awwwards style)
      fallbackTimeout = setTimeout(() => {
        window.removeEventListener('load', handleReady);
        completeLoading();
      }, 1200); 
    };

    runDynamicLoading();

    return () => {
      isMounted = false;
      window.removeEventListener('load', handleReady);
      clearTimeout(fallbackTimeout);
      // ── Critical — always restore body scroll on unmount ──
      document.body.style.overflow = '';
      gsap.killTweensOf(progressObjRef.current);
      initialTween.kill();
      // Kill the exit timeline if still running (e.g. HMR, StrictMode double-mount)
      exitTlRef.current?.kill();
    };
  }, [onComplete, reducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full flex z-[9999] pointer-events-none"
    >
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit-1 { animation: orbit-spin 5s linear infinite; }
        .animate-orbit-2 { animation: orbit-spin 6.5s linear infinite reverse; }
        @keyframes dot-blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-blink-1 { animation: dot-blink 1.2s infinite ease-in-out; }
        .animate-blink-2 { animation: dot-blink 1.2s infinite ease-in-out 0.15s; }
        .animate-blink-3 { animation: dot-blink 1.2s infinite ease-in-out 0.3s; }
      `}</style>
      
      {[0, 1, 2, 3].map((_, i) => (
        <div 
          key={i}
          ref={el => columnRefs.current[i] = el}
          className="flex-1 bg-[#1c5fdf] pointer-events-auto will-change-transform contain-paint"
        ></div>
      ))}

      <div 
        ref={contentRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center pointer-events-auto w-full max-w-2xl px-6 will-change-[opacity,transform]"
      >
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-12 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-[1.5px] border-white/20"></div>
           <div className="absolute inset-6 sm:inset-8 md:inset-10 rounded-full border-[1px] border-white/10"></div>
           
           <div className="w-2.5 h-2.5 bg-white rounded-full z-10 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"></div>

           <div 
             className="absolute inset-[-4px] rounded-full animate-orbit-1"
             style={{
               background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(255,255,255,0.5) 100%)',
               maskImage: 'radial-gradient(transparent 30%, black 31%)',
               WebkitMaskImage: 'radial-gradient(transparent 30%, black 31%)'
             }}
           ></div>
           
           <div 
             className="absolute inset-2 sm:inset-4 md:inset-6 rounded-full animate-orbit-2"
             style={{
               background: 'conic-gradient(from 180deg, transparent 0%, transparent 80%, rgba(255,255,255,0.3) 100%)',
               maskImage: 'radial-gradient(transparent 40%, black 41%)',
               WebkitMaskImage: 'radial-gradient(transparent 40%, black 41%)'
             }}
           ></div>
        </div>

        <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-white z-10 tracking-[0.1em] mb-4 text-center">
          ICE TECH
        </div>

        <div className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-wider flex items-baseline justify-center">
          {String(progress).padStart(3, ' ')}<span className="text-sm ml-1 text-white/80">/100</span>
        </div>

        <div className="w-64 sm:w-80 md:w-96 h-[4px] bg-white/20 rounded-full overflow-hidden mb-5">
          <div
            ref={progressBarRef}
            className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all ease-out duration-[50ms]"
            style={{ width: '0%', willChange: 'width' }}
          ></div>
        </div>

        <div 
          ref={statusRef}
          className="text-[10px] sm:text-[11px] text-white/70 tracking-[0.2em] uppercase font-semibold h-5 mb-6 text-center"
        >
          INITIALIZING...
        </div>

        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-blink-1"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-blink-2"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-blink-3"></div>
        </div>
      </div>
    </div>
  );
};

export default StartingAnimation;
