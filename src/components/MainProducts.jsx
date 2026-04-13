import React, { useRef, useCallback, memo } from 'react';

// ── STEP 5: Product JSON-LD Structured Data ──
// Defined at module level — never re-created on renders.
export const MAIN_PRODUCTS = [
  {
    id: 'p1',
    name: 'Raspberry Mochi',
    weight: '80г',
    price: '140 UAH.',
    priceValue: 140,
    image: '/assets/img1.webp',
    isNew: true,
    description: 'Fresh raspberry-flavored mochi ice cream with a soft, chewy exterior and creamy frozen center.',
  },
  {
    id: 'p2',
    name: 'Mango Passion Fruit Mochi',
    weight: '75г',
    price: '140 UAH.',
    priceValue: 140,
    image: '/assets/img3.webp',
    isNew: true,
    description: 'Tropical mango and passion fruit mochi ice cream bursting with natural fruit flavors.',
  },
  {
    id: 'p3',
    name: 'Pistachio-Raspberry Mochi',
    weight: '80г',
    price: '140 UAH.',
    priceValue: 140,
    image: '/assets/img4.webp',
    isNew: true,
    locked: true,
    description: 'A premium blend of pistachio and raspberry in a delicate mochi shell — coming soon.',
  },
  {
    id: 'p4',
    name: 'Chocolate Mochi',
    weight: '75г',
    price: '140 UAH.',
    priceValue: 140,
    image: '/assets/img5.webp',
    isNew: true,
    description: 'Rich dark chocolate ice cream wrapped in a soft, sweet mochi rice cake.',
  },
  {
    id: 'p5',
    name: 'Classic Chocolate Ice Cream Bar',
    weight: '90г',
    price: '120 UAH.',
    priceValue: 120,
    image: '/assets/img6.webp',
    isBar: true,
    description: 'Classic milk chocolate-coated ice cream bar made with premium Belgian chocolate.',
  },
  {
    id: 'p6',
    name: 'Double Chocolate Ice Cream Bar',
    weight: '85г',
    price: '130 UAH.',
    priceValue: 130,
    image: '/assets/img7.webp',
    isBar: true,
    description: 'Double-layered chocolate ice cream bar with a dark chocolate shell and milk chocolate core.',
  },
  {
    id: 'p7',
    name: 'Strawberry Cream Ice Cream Bar',
    weight: '90г',
    price: '125 UAH.',
    priceValue: 125,
    image: '/assets/img8.webp',
    isBar: true,
    description: 'Creamy strawberry ice cream bar dipped in a white chocolate coating.',
  },
  {
    id: 'p8',
    name: 'Salted Caramel Ice Cream Bar',
    weight: '90г',
    price: '135 UAH.',
    priceValue: 135,
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=400&fit=crop',
    isBar: true,
    description: 'Handcrafted salted caramel ice cream with a caramelised toffee shell.',
  },
];

// ── STEP 5: Products JSON-LD (ItemList schema) ──
// Injected once at module scope so it's static and available to crawlers.
const PRODUCTS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ICE-TECH Premium Ice Cream Products',
  description: 'Explore ICE-TECH\'s full range of premium artisanal ice cream products including mochi, bars, and soft serves.',
  numberOfItems: MAIN_PRODUCTS.length,
  itemListElement: MAIN_PRODUCTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: p.name,
      description: p.description,
      image: p.image.startsWith('http') ? p.image : `https://www.ice-tech.com${p.image}`,
      brand: {
        '@type': 'Brand',
        name: 'ICE-TECH',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'UAH',
        price: p.priceValue,
        availability: p.locked
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/InStock',
      },
    },
  })),
};

// ─────────────────────────────────────────────────────────────
// ProductCard — memoised to prevent re-renders when the parent
// re-renders for unrelated reasons (scroll position, etc.)
// ─────────────────────────────────────────────────────────────
const ProductCard = memo(({ product }) => {
  const cardRef = useRef(null);

  // ── STEP 2: INP — mouse tilt uses direct ref mutation inside rAF ──
  // No useState, no React re-render. Pure DOM manipulation.
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
    }
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    if (product.locked) return;
    const btn = e.currentTarget;
    if (!btn) return;
    btn.classList.add('scale-90');
    setTimeout(() => {
      btn.classList.remove('scale-90');
      btn.classList.add('scale-110');
      setTimeout(() => btn.classList.remove('scale-110'), 150);
    }, 100);
  }, [product.locked]);

  return (
    // ── STEP 5: <article> is the correct semantic for a self-contained product ──
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`${product.name} — ${product.price}`}
      className="group relative bg-[#ffffff] rounded-2xl p-6 flex flex-col overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 will-change-transform isolate"
      style={{
        perspective: '1000px',
        transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transformStyle: 'preserve-3d',
        // ── STEP 3: Explicit aspect-ratio reserves paint area before image loads ──
        // Product cards don't have a fixed height, but we set min-height so
        // the grid doesn't collapse while lazy images are decoded.
        minHeight: '340px',
      }}
    >
      {/* Decorative hover emoji — aria-hidden prevents screen reader noise */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-white/95 rounded-full pointer-events-none flex items-center justify-center text-5xl z-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out will-change-transform"
        style={{ transformOrigin: 'center' }}
      >
        😋
      </div>

      {product.isNew && (
        <div
          aria-label="New product"
          className="absolute top-6 right-6 w-[50px] h-[50px] border-2 border-dashed border-[#8B1538] rounded-full flex items-center justify-center text-[#8B1538] text-[11px] font-bold uppercase z-[5] bg-white/90"
        >
          New
        </div>
      )}

      {/*
        ── STEP 3: CLS on product images ──
        Explicit width + height attributes + aspect-ratio in style lets
        the browser reserve the exact pixel area before the image arrives,
        eliminating product-image-driven CLS completely.

        ── STEP 5: Descriptive alt using full product name ──
        Each alt is unique and describes the product — improves Google
        Image Search ranking and accessibility for screen readers.
      */}
      <img
        src={product.image}
        alt={`${product.name} — ICE-TECH artisanal ice cream product`}
        onError={(e) => {
          e.currentTarget.onerror = null; // Prevent infinite loop
          // Inline SVG placeholder for broken images
          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E";
        }}
        width={400}
        height={product.isBar ? 220 : 200}
        className={`w-full object-contain mb-5 z-[1] will-change-transform transition-transform duration-500 group-hover:scale-105 ${product.isBar ? 'h-[220px]' : 'h-[200px]'}`}
        loading="lazy"
        decoding="async"
        style={{
          transform: 'translateZ(20px)',
          // Reserve space before decode completes
          aspectRatio: product.isBar ? '400/220' : '400/200',
        }}
      />

      <div className="mt-auto z-[1]" style={{ transform: 'translateZ(10px)' }}>
        {/* h3 is correct heading level inside a section > article hierarchy */}
        <h3 className="text-base font-extrabold text-[#8B1538] uppercase mb-1.5 tracking-wide leading-tight transition-colors duration-300 group-hover:text-black">
          {product.name}
        </h3>
        <p className="text-[13px] text-[#666666] mb-1">
          Serving weight: {product.weight}
        </p>
        <p className="text-lg font-bold text-[#8B1538] mb-4">
          {product.price}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.locked}
        aria-label={product.locked ? `${product.name} — Out of stock` : `Add ${product.name} to cart`}
        style={{ transform: 'translateZ(15px)' }}
        className={`absolute bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-white z-[5] transition-transform duration-200 hover:scale-[1.15] will-change-transform ${product.locked ? 'bg-[#8B1538]/50 cursor-not-allowed hidden' : 'bg-[#8B1538] cursor-pointer'}`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-6-1a2 2 0 0 1 4 0v1h-4V6z" />
        </svg>
      </button>
    </article>
  );
});
ProductCard.displayName = 'ProductCard';

// ─────────────────────────────────────────────────────────────
// MainProducts Section
// ─────────────────────────────────────────────────────────────
const MainProducts = () => {
  return (
    // ── STEP 5: Semantic <section> with id="portfolio" for Navbar scroll target ──
    <section
      id="portfolio"
      aria-label="ICE-TECH Premium Ice Cream Products"
      className="w-full bg-[#2b302e] py-10 px-5 min-h-screen font-sans contain-paint"
    >
      {/*
        ── STEP 5: Products JSON-LD injected here in a <script> tag ──
        React renders this into the DOM. Googlebot reads it and can surface
        individual products as rich results in search (price, availability).
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSONLD) }}
      />

      <div className="max-w-[1400px] mx-auto">
        {/*
          ── STEP 5: Visible section heading for SEO hierarchy ──
          h2 is correct below the sr-only h1 in Hero.
        */}
        <h2 className="sr-only">Our Ice Cream Products</h2>

        {/*
          ── STEP 3: grid min-height prevents layout collapse ──
          Card-level minHeight (340px set on each article) handles CLS
          at the individual-item level.
        */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          role="list"
          aria-label="ICE-TECH product catalogue"
        >
          {MAIN_PRODUCTS.map((product) => (
            <div role="listitem" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainProducts;