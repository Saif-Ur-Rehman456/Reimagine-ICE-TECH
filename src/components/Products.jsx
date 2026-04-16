import React, { useEffect, useRef, memo } from 'react';

const products = [
  { id: 1, name: 'RASPBERRY MOCHI',     tagline: 'Fruit explosion.',       image: 'assets/img1.webp',  price: '$5.99', alt: 'Raspberry Mochi ice cream — fresh fruit-flavoured mochi from ICE-TECH' },
  { id: 2, name: 'MANGO PASSION',       tagline: 'Tropical delight.',      image: 'assets/img3.webp',  price: '$6.49', alt: 'Mango Passion Fruit Mochi ice cream — tropical ICE-TECH specialty' },
  { id: 3, name: 'PISTACHIO RASPBERRY', tagline: 'Nutty fresh.',           image: 'assets/img4.webp',  price: '$6.99', alt: 'Pistachio Raspberry Mochi ice cream by ICE-TECH' },
  { id: 4, name: 'CHOCOLATE MOCHI',     tagline: 'Dark & rich.',           image: 'assets/img5.webp',  price: '$7.49', alt: 'Chocolate Mochi ice cream — dark and rich ICE-TECH creation' },
  { id: 5, name: 'CLASSIC BAR',         tagline: 'Pure chocolate.',        image: 'assets/img6.webp',  price: '$5.49', alt: 'Classic Chocolate Ice Cream Bar by ICE-TECH' },
  { id: 6, name: 'DOUBLE CHOC BAR',     tagline: 'Triple Layered.',        image: 'assets/img7.webp',  price: '$6.99', alt: 'Double Chocolate Ice Cream Bar — triple layered by ICE-TECH' },
  { id: 7, name: 'STRAWBERRY BAR',      tagline: 'Summer vibes.',          image: 'assets/img8.webp',  price: '$5.99', alt: 'Strawberry Cream Ice Cream Bar — summer edition by ICE-TECH' },
  { id: 8, name: 'VANILLA DREAM',       tagline: 'Elegance redefined.',    image: 'assets/img9.png',   price: '$5.99', alt: 'Vanilla Dream ice cream — elegantly crafted by ICE-TECH' },
];

// Double-copy for seamless -50% CSS marquee loop — computed once at module level
const doubleProducts = [...products, ...products];

// ── STEP 3 & 2: @keyframes defined outside JSX ──
// Defined as a string constant so React never re-injects the <style> tag
// on re-renders. Also uses a unique prefix `products-` to avoid collision
// with ScrollClipMask's `infinite-scroll` keyframe name.
const MARQUEE_STYLES = `
  @keyframes products-marquee {
    0%   { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
  .products-marquee-track {
    animation: products-marquee 18s linear infinite;
    /* ── STEP 2: will-change scoped to the moving element only ── */
    will-change: transform;
  }
  .products-marquee-track:hover {
    animation-play-state: paused;
  }
`;

// ─────────────────────────────────────────────────────────────
// ProductCard — memoised; mouse tilt uses rAF + direct DOM
// mutation only — zero React re-renders on pointer move (INP).
// ─────────────────────────────────────────────────────────────
const ProductCard = memo(({ product }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let rafId = null;

    // ── STEP 2: rAF-throttled pointer handler — no setState ──
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;
        const rotateX = (e.clientY - rect.top  - centerY) / 20;
        const rotateY = (centerX - (e.clientX - rect.left)) / 20;

        // Write directly to CSS custom props — GPU compositor handles the rest
        card.style.setProperty('--rx',    `${rotateX}deg`);
        card.style.setProperty('--ry',    `${rotateY}deg`);
        card.style.setProperty('--scale', '1.05');
        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      card.style.setProperty('--rx',    '0deg');
      card.style.setProperty('--ry',    '0deg');
      card.style.setProperty('--scale', '1');
    };

    card.addEventListener('mousemove',  handleMouseMove,  { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove',  handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    // ── STEP 5: <article> is the correct semantic for a standalone product card ──
    <article
      ref={cardRef}
      aria-label={`${product.name} — ${product.price}`}
      className="relative flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] h-[60vh] sm:h-[65vh] md:h-[70vh] rounded-[2.5rem] overflow-hidden group mr-6 sm:mr-8 md:mr-10 select-none will-change-transform isolate"
      style={{
        perspective:      '1000px',
        transform:        'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--scale, 1))',
        transition:       'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformStyle:   'preserve-3d',
        // ── STEP 3: Explicit min dimensions prevent grid/flex collapse before image loads ──
        minWidth:  '280px',
        minHeight: '320px',
      }}
    >
      {/*
        ── STEP 3: width + height attributes on every image ──
        Even though the card stretches to fill, the explicit attrs give the
        browser an aspect-ratio hint before CSS resolves, preventing CLS.

        ── STEP 5: Descriptive, unique alt per image ──
        Each alt drives Google Image Search discovery for that flavour.
      */}
      <img
        src={product.image}
        alt={product.alt}
        width={600}
        height={800}
        className="w-full h-full object-cover transition-[filter] duration-700 brightness-[0.9] group-hover:brightness-100 will-change-[filter] backface-hidden block"
        loading="lazy"
        decoding="async"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Decorative gradient — aria-hidden keeps it out of a11y tree */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none select-none z-10"
      />

      <div
        className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end pointer-events-none z-20"
        style={{ transform: 'translateZ(30px)' }}
      >
        {/* h3 inside article — correct heading hierarchy */}
        <h3 className="font-headline text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-1 drop-shadow-lg">
          {product.name}
        </h3>
        <div className="flex justify-between items-end drop-shadow-md">
          <p className="font-body text-white/80 text-xs md:text-sm uppercase tracking-widest font-bold">
            {product.tagline}
          </p>
          <span className="font-headline text-lg md:text-xl font-bold text-white">
            {product.price}
          </span>
        </div>
      </div>
    </article>
  );
});
ProductCard.displayName = 'ProductCard';

// ─────────────────────────────────────────────────────────────
// Products Section
// ─────────────────────────────────────────────────────────────
const Products = () => {
  return (
    // ── STEP 5: Semantic <section> with aria-label ──
    <section
      aria-label="ICE-TECH Most Popular Ice Cream Collection"
      className="bg-surface py-20 md:py-32 overflow-hidden relative z-20 contain-paint"
    >
      {/* Style injected once into <head> via React's style hoisting */}
      <style>{MARQUEE_STYLES}</style>

      {/* Section header */}
      <div className="px-6 sm:px-12 md:px-20 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-label text-sm font-bold tracking-[0.3em] uppercase mb-3 block">
            Most Popular
          </span>
          {/*
            ── STEP 5: h2 (below Hero's sr-only h1) is the correct level here ──
            Descriptive heading aids Google's document outline understanding.
          */}
          <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tighter leading-[0.9]">
            INFINITE <br />
            <span className="text-surface-container-highest flex items-center gap-4">
              FLAVORS
              {/* Decorative rule — aria-hidden */}
              <div aria-hidden="true" className="h-1 w-20 md:w-40 bg-primary/20 rounded-full hidden sm:block" />
            </span>
          </h2>
        </div>
        <p className="font-body text-on-surface-variant max-w-sm text-sm md:text-base font-medium uppercase tracking-wider leading-relaxed">
          Our best-selling collection, designed for those who never settle for anything less than extraordinary.
        </p>
      </div>

      {/*
        Marquee track — the animation is purely CSS driven.
        ── STEP 2: will-change:transform is scoped to this element only ──
        ── STEP 5: aria-hidden because it duplicates listed products ──
      */}
      <div
        className="products-marquee-track flex items-center w-max px-6 sm:px-12 md:px-20 contain-layout"
        aria-hidden="true"
      >
        {doubleProducts.map((product, i) => (
          <ProductCard key={`${product.id}-${i}`} product={product} />
        ))}
      </div>

      {/* Decorative watermark text — already has aria-hidden in original ✓ */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-on-surface/[0.03] select-none pointer-events-none z-[-1] whitespace-nowrap"
      >
        POPULAR COLLECTION
      </div>
    </section>
  );
};

export default Products;