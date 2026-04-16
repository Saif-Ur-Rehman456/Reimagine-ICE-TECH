import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ScrollClipMask = () => {
  const containerRef = useRef(null);
  const stickyRef   = useRef(null);
  const maskRef     = useRef(null);
  const imageRef    = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // ── STEP 3: prefers-reduced-motion bypass & Mobile bypass ──
    const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    
    if (reducedMotion || isMobile) {
      gsap.set(maskRef.current, { clipPath: 'inset(10% 10% 10% 10% round 24px)' });
      gsap.set(imageRef.current, { scale: 1 });
      gsap.set('.marquee-wrapper', { opacity: 1 });
      return;
    }

    // ── STEP 2: GPU-ONLY animation audit ──
    // clip-path  → compositor (no layout cost) ✓
    // scale      → compositor (no layout cost) ✓
    // opacity    → compositor (no layout cost) ✓
    // No top / left / width / height / margin animated anywhere ✓
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=180%',
        pin: stickyRef.current,
        pinSpacing: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
        refreshPriority: -1,
      },
    });

    tl.fromTo(
      maskRef.current,
      { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      { clipPath: 'inset(20% 20% 20% 20% round 48px)', ease: 'power2.inOut' },
      0
    );

    tl.fromTo(
      imageRef.current,
      { scale: 1 },
      {
        // ── STEP 2: scale only — GPU composite layer, zero layout cost ──
        scale: 1.1,
        ease: 'power2.inOut',
      },
      0
    );

    // Marquee fade-in — opacity is compositor-safe ✓
    gsap.fromTo(
      '.marquee-wrapper',
      { opacity: 0.4 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'center center',
          scrub: true,
        },
      }
    );

    ScrollTrigger.refresh();
  }, { scope: containerRef, dependencies: [reducedMotion] });

  const words = ['BRIGHT', '*', 'PRODUCTS', '*', 'ALWAYS', '*', 'NATURALLY', '*', 'WE', '*'];
  const rows  = [0, 1, 2];

  return (
    // ── STEP 5: Semantic <section> with aria-label for Google ──
    <section
      ref={containerRef}
      aria-label="ICE-TECH Premium Quality showcase"
      className="relative w-full overflow-hidden"
      style={{ zIndex: 10, backgroundColor: '#FDF1E1' }}
    >
      {/*
        Keyframes defined once at module level (via <style> in the sticky
        wrapper) so React reconciler never re-injects them on re-renders.
      */}
      <style>{`
        @keyframes infinite-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll var(--duration, 40s) linear infinite;
          /* ── STEP 2: will-change scoped tightly to the animated element ── */
          will-change: transform;
        }
      `}</style>

      {/*
        ── STEP 3: CLS Guard ──
        The sticky container is `h-screen` which is set BEFORE JS runs,
        so the browser allocates 100vh of space immediately — no shift.
      */}
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#FDF1E1' }}
      >
        {/*
          ── STEP 5: aria-hidden on marquee ──
          The repeating words are purely decorative/branding and would
          create keyword-stuffing noise for crawlers + confuse screen
          readers. Hidden from the a11y tree entirely.
        */}
        <div
          aria-hidden="true"
          className="marquee-wrapper absolute inset-0 z-0 flex flex-col justify-center pb-[5vh] pointer-events-none select-none overflow-hidden origin-center rotate-[-6deg] scale-125"
        >
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div
                key={row}
                className="flex whitespace-nowrap"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 900,
                  fontSize: '8.5vw',
                  lineHeight: '1.3',
                  color: '#9F142D',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                }}
              >
                {/*
                  Two copies rendered so -50% translateX creates a seamless
                  infinite loop. Only the inner track element animates —
                  the outer row div is static (no layout thrashing).
                */}
                <div
                  className="flex animate-infinite-scroll h-full items-center"
                  style={{ '--duration': `${30 + row * 10}s` }}
                >
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex flex-shrink-0 items-center">
                      {words.map((word, index) => {
                        const isOutline = (index + row) % 2 !== 0;
                        return (
                          <span
                            key={index}
                            className="px-3"
                            style={
                              isOutline
                                ? { WebkitTextStroke: '1.5px #9F142D', color: 'transparent' }
                                : {}
                            }
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*
          ── STEP 3: Clip-Mask wrapper ──
          will-change scoped ONLY to this element (not its children).
          Explicit w-full / h-full so the browser knows the intrinsic size
          before the clip-path animation is calculated — prevents CLS.
        */}
        <div
          ref={maskRef}
          className="relative z-10 w-full h-full"
          style={{ willChange: 'clip-path' }}
        >
          {/*
            ── STEP 3: Explicit dimensions on the image ──
            width / height attributes tell the browser the intrinsic size
            immediately so it can reserve the right amount of space before
            the image bytes arrive — directly eliminating CLS.

            ── STEP 2: Image scale animated via GSAP on a separate layer ──
            The <img> itself gets will-change:transform so the browser
            promotes it to its own compositor layer. Scale changes stay
            entirely GPU-resident with no layout recalculation.

            ── STEP 5: Descriptive alt text for Google Image Search ──
            "decorative" or empty alt would lose image-search traffic.
          */}
          <img
            ref={imageRef}
            src="assets/im2.webp"
            alt="ICE-TECH premium ice cream product — creamy soft serve in a cone"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ willChange: 'transform' }}
          />
        </div>
      </div>
    </section>
  );
};

export default ScrollClipMask;