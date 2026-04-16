import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// ── STEP 1: Module-level debounce — created ONCE, never recreated on renders ──
// Putting this inside the component body created a NEW debounced function on
// every render, orphaning the previous timer reference.
const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
const _debouncedSTRefresh = debounce(() => ScrollTrigger.refresh(), 200);

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  // Refs for animation state — no React state used for hot-path data
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const renderScheduledRef = useRef(false);
  const rafIdRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(2);
  const mountedRef = useRef(true);

  const frameCount = 120;

  const preloadSequence = useCallback(async (abortSignal) => {
    const rawDpr = window.devicePixelRatio || 1;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    dprRef.current = isMobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2);

    const loadFrame = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = (index + 1).toString().padStart(3, '0');
        const prefixNum = index + 17;
        img.src = `ICE-TECH/imgi_${prefixNum}_ezgif-frame-${frameNum}.webp`;

        img.onload = () => {
          imagesRef.current[index] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    };

    // ── STEP 1: Load & decode frame 0 first for instant LCP ──
    const firstImg = await loadFrame(0);
    if (!mountedRef.current || abortSignal.aborted) return;

    if (firstImg) {
      await firstImg.decode?.().catch(() => {});
      setFirstFrameLoaded(true);
    }

    // ── STEP 1: Remaining 119 frames loaded on idle — main thread stays free ──
    const loadRest = async () => {
      for (let i = 1; i < frameCount; i++) {
        if (!mountedRef.current || abortSignal.aborted) return;
        const img = await loadFrame(i);
        if (img) img.decode?.().catch(() => {});
        // Yield to main thread every 5 frames to preserve INP budget
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => loadRest(), { timeout: 3000 });
    } else {
      setTimeout(loadRest, 200);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const abortController = new AbortController();
    preloadSequence(abortController.signal);

    return () => {
      mountedRef.current = false;
      abortController.abort();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [preloadSequence]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const img = imagesRef.current[frameIndexRef.current];
    if (!img || !img.complete) {
      renderScheduledRef.current = false;
      return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) * 0.5;
    const ny = (ch - nh) * 0.5;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);

    renderScheduledRef.current = false;
  }, []);

  const scheduleRender = useCallback(() => {
    if (renderScheduledRef.current) return;
    renderScheduledRef.current = true;
    rafIdRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = dprRef.current;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    scheduleRender();
    // ── STEP 1: Use module-level debounce — no stale ref risk ──
    _debouncedSTRefresh();
  }, [scheduleRender]);

  useGSAP(
    () => {
      if (!firstFrameLoaded) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      ctxRef.current = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false,
      });

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      // ── STEP 3: prefers-reduced-motion bypass ──
      // Show the first frame statically with no ScrollTrigger timeline.
      // The canvas is sized and drawn by resizeCanvas() above.
      if (reducedMotion) {
        return () => window.removeEventListener('resize', resizeCanvas);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      });

      const playhead = { frame: 0 };
      tl.to(playhead, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        duration: 3,
        onUpdate: () => {
          if (playhead.frame !== frameIndexRef.current) {
            frameIndexRef.current = playhead.frame;
            scheduleRender();
          }
        }
      });

      tl.to(
        canvas,
        {
          opacity: 0,
          scale: 0.82,
          yPercent: -12,
          filter: 'blur(8px)',
          ease: 'power3.out',
          duration: 0.8,
        },
        '>'
      );

      ScrollTrigger.refresh();

      if (lenis) requestAnimationFrame(() => lenis.resize());

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    },
    { dependencies: [firstFrameLoaded, lenis, reducedMotion], scope: containerRef }
  );

  return (
    // ── STEP 3: section gets explicit min-height so browser reserves space
    //    before canvas dimensions are calculated — eliminates CLS ──
    <section
      ref={containerRef}
      id="hero"
      aria-label="ICE-TECH cinematic hero sequence"
      className={`relative w-screen overflow-hidden bg-[#0D1A1A] transition-opacity duration-500 ${firstFrameLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        perspective: '1200px',
        height: '100svh',         // svh = accounts for mobile browser chrome
        minHeight: '100vh',       // fallback: prevents CLS before svh resolves
        aspectRatio: 'auto',
      }}
    >
      {/*
        ── STEP 5: SEO SEMANTIC LAYER ──
        Crawlers cannot "see" canvas. This sr-only block gives Googlebot
        a fully semantic h1 + description anchored to the hero section.
        Visually hidden via the sr-only utility but fully in the DOM.
      */}
      <div className="sr-only">
        <h1>ICE-TECH — Premium Artisanal Ice Cream Est. 1990</h1>
        <p>
          Experience the cinematic world of ICE-TECH, Pakistan's finest ice cream brand.
          Crafting fresh soft serves, shakes, and signature cones since 1990 across
          Gujranwala, Lahore, and Sialkot.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="ICE-TECH product showcase — a scroll-driven cinematic animation"
        className="block w-full h-full"
        style={{
          willChange: 'transform, opacity, filter',
          transform: 'translateZ(0)',
        }}
      />

      {/* STEP 5: aria-hidden — purely decorative vignette, not meaningful content */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, #0D1A1A 95%)',
          opacity: 0.25,
        }}
      />

      {firstFrameLoaded && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in duration-1000 delay-500">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-7 h-11 md:w-8 md:h-12 rounded-full border border-[#00f2fe]/30 flex justify-center p-1 backdrop-blur-sm bg-black/20">
              <div className="w-1 md:w-1.5 h-2.5 md:h-3 bg-gradient-to-b from-[#00f2fe] to-[#4facfe] rounded-full animate-soft-bounce shadow-[0_0_15px_#00f2fe]" />
              {/* aria-hidden: decorative ping ring */}
              <div aria-hidden="true" className="absolute inset-0 rounded-full border border-[#00f2fe]/10 animate-ping opacity-50" />
            </div>
            <span className="text-[#00f2fe]/60 text-[10px] md:text-xs uppercase tracking-[0.4em] font-light">
              Scroll
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes soft-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-soft-bounce {
          animation: soft-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;