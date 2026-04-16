import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const renderScheduledRef = useRef(false);
  const rafIdRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(2);
  const mountedRef = useRef(true);

  const frameCount = 120;
  
  // Check if it's a mobile device (runs once on mount)
  useEffect(() => {
    const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const preloadSequence = useCallback(async (abortSignal) => {
    if (isMobile) {
        // Mobile: only load the first frame for static display
        const img = new Image();
        img.src = `ICE-TECH/imgi_17_ezgif-frame-001.webp`;
        img.onload = () => {
            if (mountedRef.current) setFirstFrameLoaded(true);
        }
        return;
    }

    const rawDpr = window.devicePixelRatio || 1;
    dprRef.current = Math.min(rawDpr, 2);

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

    // Load first frame instantly
    const firstImg = await loadFrame(0);
    if (!mountedRef.current || abortSignal.aborted) return;
    if (firstImg) {
      await firstImg.decode?.().catch(() => {});
      setFirstFrameLoaded(true);
    }

    // Defer remaining 119 frames to idle periods (reduces main thread lag)
    const loadRest = async () => {
      for (let i = 1; i < frameCount; i++) {
        if (!mountedRef.current || abortSignal.aborted) return;
        const img = await loadFrame(i);
        // Minimal decoding to not block main thread
        // Yield heavily to main thread every 2 frames
        if (i % 2 === 0) await new Promise(r => setTimeout(r, 0));
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => loadRest(), { timeout: 2000 });
    } else {
      setTimeout(loadRest, 100);
    }
  }, [isMobile]);

  useEffect(() => {
    // Only start preloading after mobile check is done
    if (isMobile === undefined) return;
    
    const abortController = new AbortController();
    preloadSequence(abortController.signal);
    return () => abortController.abort();
  }, [preloadSequence, isMobile]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || isMobile) return;

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
    // Remove smoothing for much faster rendering, or rely on hardware low-quality
    ctx.imageSmoothingEnabled = false; 
    ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);

    renderScheduledRef.current = false;
  }, [isMobile]);

  const scheduleRender = useCallback(() => {
    if (renderScheduledRef.current) return;
    renderScheduledRef.current = true;
    rafIdRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);

  const resizeCanvas = useCallback(() => {
    if (isMobile) return;
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
  }, [scheduleRender, isMobile]);

  useGSAP(
    () => {
      // Mobile: disable ALL GSAP animations to save CPU/Battery
      if (!firstFrameLoaded || isMobile || reducedMotion) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      ctxRef.current = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,    // Fast path for low latency
        willReadFrequently: false,
      });

      resizeCanvas();
      
      let resizeTimer;
      const handleResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
              resizeCanvas();
              ScrollTrigger.refresh();
          }, 150);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.5}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.1, // drastically reduced scrub delay for instant response (no lag feeling)
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      const playhead = { frame: 0 };
      tl.to(playhead, {
        frame: frameCount - 1,
        snap: 'frame', // Snap to exact integer frames for sharpness
        ease: 'none',
        onUpdate: () => {
          const nextFrame = Math.round(playhead.frame);
          if (nextFrame !== frameIndexRef.current) {
            frameIndexRef.current = nextFrame;
            scheduleRender();
          }
        }
      });

      tl.to(
        canvas,
        {
          opacity: 0,
          scale: 0.85,
          yPercent: -10,
          filter: 'blur(4px)',
          ease: 'power2.inOut',
        },
        '>-20%' // Start fading out slightly before sequence ends
      );

      ScrollTrigger.refresh();
      if (lenis) requestAnimationFrame(() => lenis.resize());

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    { dependencies: [firstFrameLoaded, lenis, reducedMotion, isMobile], scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="ICE-TECH cinematic hero sequence"
      className={`relative w-screen overflow-hidden bg-surface transition-opacity duration-700 ${firstFrameLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        perspective: '1200px',
        height: '100svh',
        minHeight: '100vh',
      }}
    >
      <div className="sr-only">
        <h1>ICE-TECH — Premium Artisanal Ice Cream Est. 1990</h1>
        <p>
          Experience the cinematic world of ICE-TECH, Pakistan's finest ice cream brand.
          Crafting fresh soft serves, shakes, and signature cones since 1990 across
          Gujranwala, Lahore, and Sialkot.
        </p>
      </div>

      {isMobile ? (
          // Mobile Fallback: Fast, CSS-only static background image (0 JS overhead)
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
                backgroundImage: `url('ICE-TECH/imgi_17_ezgif-frame-001.webp')`
            }}
          />
      ) : (
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
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, #0D1A1A 100%)',
          opacity: 0.4,
        }}
      />

      {firstFrameLoaded && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in duration-1000 delay-500">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-7 h-11 md:w-8 md:h-12 rounded-full border border-primary/40 flex justify-center p-1 backdrop-blur-sm bg-black/30">
              <div className="w-1 md:w-1.5 h-2.5 md:h-3 bg-primary rounded-full animate-soft-bounce shadow-[0_0_15px_1px_rgba(26,86,219,0.5)]" />
            </div>
            <span className="text-primary/70 text-[10px] md:text-xs uppercase tracking-[0.4em] font-light font-label">
              Scroll
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes soft-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-soft-bounce {
          animation: soft-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;