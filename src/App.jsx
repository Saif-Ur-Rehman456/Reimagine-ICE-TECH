import React, {
  useEffect,
  useState,
  useRef,
  lazy,
  Suspense,
} from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ErrorBoundary from './components/ErrorBoundary';

// ── STEP 4: ABOVE-THE-FOLD components — loaded eagerly ──
// These are needed at first paint: the loader, the navbar, the hero, and
// the transition overlay. They must NOT be lazy because they are either
// visible before any scroll or control critical UX flow.
import Hero              from './components/Hero';
import Navbar            from './components/Navbar';
import StartingAnimation from './components/StartingAnimation';
import TransitionOverlay from './components/TransitionOverlay';
import { TransitionProvider } from './context/TransitionContext';
import CustomKeyboardScroll from './components/CustomKeyboardScroll';

// ── STEP 4: BELOW-THE-FOLD components — code-split via React.lazy ──
// The browser will only download & parse these chunks AFTER the critical
// above-the-fold JS is evaluated. Each lazy import becomes its own chunk
// in the Rollup/Vite build, directly reducing the initial JS parse budget
// and improving TTI (Time to Interactive) and Speed Index.
const About          = lazy(() => import('./components/About'));
const ScrollClipMask = lazy(() => import('./components/ScrollClipMask'));
const MainProducts   = lazy(() => import('./components/MainProducts'));
const Products       = lazy(() => import('./components/Products'));
const CTA            = lazy(() => import('./components/CTA'));
const Footer         = lazy(() => import('./components/Footer'));

gsap.registerPlugin(ScrollTrigger);

// ── Helper: syncs ScrollTrigger recalculation with Lenis scroll events ──
// Called on every Lenis raf tick so GSAP's scroll position stays accurate.
function ScrollTriggerConfig() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

// Minimal, layout-stable skeleton — holds space while a lazy chunk loads.
const SectionSkeleton = ({ minHeight = '100vh' }) => (
  <div
    role="status"
    aria-label="Loading section…"
    style={{ minHeight, background: 'transparent' }}
  />
);

// ── STEP 2 & 4: Combined ErrorBoundary + Suspense wrapper ──
// A crashed section renders a transparent height-preserving placeholder
// instead of bringing down the whole page.
const LazySection = ({ minHeight = '100vh', children }) => (
  <ErrorBoundary sectionFallback minHeight={minHeight}>
    <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── STEP 2: lagSmoothing(0) prevents GSAP from compressing time when
    //    the tab is backgrounded, which can cause jumpy animations on return ──
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.normalizeScroll(false);

    // Multiple refresh passes to catch staggered component mount timings.
    // GSAP ScrollTrigger needs a refresh once all sections have settled in
    // the DOM — the sequence handles async lazy-chunk hydration timing.
    const refreshSequence = [100, 500, 1000, 2000];
    const timers = refreshSequence.map(delay =>
      setTimeout(() => ScrollTrigger.refresh(), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Refresh ScrollTrigger once the loader exits so pinned heroes are correct
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => ScrollTrigger.refresh(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <TransitionProvider>
      <ReactLenis
        root
        options={{
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        }}
      >
        <ScrollTriggerConfig />
        <CustomKeyboardScroll />
        <TransitionOverlay />
        <Navbar />

        {loading && <StartingAnimation onComplete={() => setLoading(false)} />}

        {/*
          ── STEP 5: Semantic <main> wrapper ──
          Google uses <main> as the primary content landmark.
          It also provides the `role="main"` a11y landmark for free.
        */}
        <main
          className={`bg-icy-blue min-h-screen text-rich-chocolate font-inter overflow-x-clip selection:bg-warm-caramel selection:text-rich-chocolate transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Hero is above-the-fold — eagerly loaded, no Suspense needed */}
          <Hero />

          {/*
            ── STEP 4: Each lazy section wrapped in its own Suspense boundary ──
            Isolated boundaries mean a slow chunk for one section never
            blocks other sections from rendering. The SectionSkeleton holds
            the layout stable (no CLS) while the chunk downloads.
          */}
          <LazySection minHeight="100vh">
            <About />
          </LazySection>

          <LazySection minHeight="100vh">
            <ScrollClipMask />
          </LazySection>

          <LazySection minHeight="100vh">
            <MainProducts />
          </LazySection>

          <LazySection minHeight="60vh">
            <Products />
          </LazySection>

          <LazySection minHeight="40vh">
            <CTA />
          </LazySection>

          <LazySection minHeight="40vh">
            <Footer />
          </LazySection>
        </main>
      </ReactLenis>
    </TransitionProvider>
  );
}

export default App;
