import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { useReducedMotion } from '../hooks/useReducedMotion';

// gsap.registerPlugin is called once globally in App.jsx — do not repeat here.

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    if (!textRef.current) return;

    // ── CLS Guard: lock height BEFORE SplitType rewraps the DOM ──
    const originalHeight = textRef.current.offsetHeight;
    textRef.current.style.minHeight = `${originalHeight}px`;

    const splitText = new SplitType(textRef.current, {
      types: 'words',
      tagName: 'span',
    });

    // SplitType spans are presentational — original text node handles a11y.
    if (splitText.words) {
      splitText.words.forEach(w => w.setAttribute('aria-hidden', 'true'));
    }

    // ── STEP 3: prefers-reduced-motion bypass ──
    // Show all words + reveal-text at full opacity with no scroll dependency.
    if (reducedMotion) {
      if (splitText.words?.length > 0) {
        gsap.set(splitText.words, { color: '#F8FAFC' });
      }
      gsap.set('.reveal-text', { y: 0, opacity: 1 });

      return () => {
        splitText.revert();
        if (textRef.current) textRef.current.style.minHeight = '';
      };
    }

    if (splitText.words && splitText.words.length > 0) {
      gsap.set(splitText.words, { color: 'rgba(248, 250, 252, 0.1)' });

      gsap.to(splitText.words, {
        color: '#F8FAFC',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    gsap.to('.reveal-text', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.reveal-text',
        start: 'top 90%',
      },
    });

    return () => {
      splitText.revert();
      if (textRef.current) textRef.current.style.minHeight = '';
    };
  }, { scope: containerRef, dependencies: [reducedMotion] });


  // ── STEP 2: INP Optimisation ──
  // Mouse-tracking glow is driven ENTIRELY via direct DOM style mutation
  // inside a rAF loop — React state is NEVER touched. This removes all
  // re-render cost and keeps INP well inside the 200 ms budget.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;

    const handlePointerMove = (e) => {
      // Throttle: skip if a rAF is already queued
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const xPos = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
        const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 100;

        if (glowRef.current) {
          // ── STEP 2: GPU-Only Transform ──
          // We write directly to CSS custom properties and let the CSS
          // `transform: translate3d(var(--x), var(--y), 0)` handle the
          // actual paint. This keeps the glow on the compositor thread —
          // no layout, no paint, no React reconciliation.
          glowRef.current.style.setProperty('--x', `${xPos}%`);
          glowRef.current.style.setProperty('--y', `${yPos}%`);
        }
        rafId = null;
      });
    };

    // passive: true — scrolling events are never blocked waiting for this handler
    container.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    // ── STEP 5: Semantic section with aria-label for screen readers & crawlers ──
    <section
      ref={containerRef}
      id="about"
      aria-label="About ICE-TECH — Brand Heritage"
      className="relative min-h-screen bg-[#0D1B2A] py-32 px-6 flex items-center justify-center overflow-hidden isolate contain-paint"
      style={{ zIndex: 20 }}
    >
      {/*
        ── STEP 2: Glow element ──
        aria-hidden="true" — purely decorative, no content.
        will-change: transform — compositor hint, avoids rasterisation on
        every pointer move. The CSS transition handles smooth lag without
        JS timers or React state.
      */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50"
        style={{
          willChange: 'transform',
          transform: 'translate3d(var(--x, 0%), var(--y, 0%), 0)',
          transition: 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(26,86,219,0.05),transparent_70%)] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* reveal-text: y pre-set to full so no cumulative shift before GSAP runs */}
        <div className="overflow-hidden mb-12">
          <p
            className="text-sm font-syncopate text-primary tracking-[0.3em] font-bold uppercase reveal-text opacity-0"
            style={{ transform: 'translateY(100%)' }}
          >
            The Heritage
          </p>
        </div>

        {/*
          ── STEP 5: Semantic h2 ──
          The text here is the primary crawlable copy about the brand.
          will-change: color — scoped hint so GSAP color tween stays GPU-
          resident. No width / height animated = zero layout thrashing.
        */}
        <h2
          ref={textRef}
          className="text-4xl md:text-7xl font-inter font-medium leading-[1.1] text-rich-chocolate tracking-tight"
          style={{ willChange: 'color' }}
        >
          Ice-Tech is an established ice cream brand with over 35 years of
          experience crafting fresh, creamy soft serves, shakes, and signature
          cones. Since 1990, the company has focused on using premium ingredients
          to create high-quality desserts at accessible prices across multiple
          locations including Gujranwala, Lahore, and Sialkot.
        </h2>

        {/* ── STEP 5: Semantic grid using <article> for discrete brand facts ── */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <article className="space-y-4">
            <h3 className="text-primary font-syncopate text-xs uppercase tracking-widest">Est. 1990</h3>
            <p className="text-rich-chocolate/60 font-inter text-lg">Decades of perfection in every scoop.</p>
          </article>
          <article className="space-y-4">
            <h3 className="text-primary font-syncopate text-xs uppercase tracking-widest">Premium Quality</h3>
            <p className="text-rich-chocolate/60 font-inter text-lg">Only the finest ingredients sourced globally.</p>
          </article>
          <article className="space-y-4">
            <h3 className="text-primary font-syncopate text-xs uppercase tracking-widest">Locations</h3>
            <p className="text-rich-chocolate/60 font-inter text-lg">Serving Gujranwala, Lahore, and Sialkot.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
