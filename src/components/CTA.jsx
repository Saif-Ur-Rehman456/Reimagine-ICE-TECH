import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const CTA = () => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    // Use QuickTo for best cursor tracking performance (Awwwards standard)
    const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" });

    let isHovering = false;
    let rafId = null;

    const handleMouseMove = (e) => {
      isHovering = true;
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const boundingRect = btn.getBoundingClientRect();
        const centerX = boundingRect.left + boundingRect.width / 2;
        const centerY = boundingRect.top + boundingRect.height / 2;
        
        // 0.4 sets the magnetic pull strength
        const deltaX = (e.clientX - centerX) * 0.4;
        const deltaY = (e.clientY - centerY) * 0.4;

        if (isHovering) {
          xTo(deltaX);
          yTo(deltaY);
        }
        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove, { passive: true });
    btn.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(btn);
    };
  }, []);

  return (
    <div className="relative z-30 bg-transparent contain-paint">
        <section 
            className="min-h-[100vh] flex flex-col items-center justify-center gap-8 py-24 relative overflow-hidden"
            style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#1A56DB', 
                borderTopLeftRadius: '3rem',
                borderTopRightRadius: '3rem',
                boxShadow: '0 -20px 50px rgba(0,0,0,0.3)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
        >
            <h2 
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-surface uppercase tracking-tight md:tracking-wider text-center mb-4 md:mb-6 z-10 w-full px-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
                Embrace the <br/>
                <span 
                    className="text-primary-container font-light tracking-normal lowercase block mt-4"
                    style={{ fontFamily: 'Zapfino, "Plus Jakarta Sans", sans-serif' }}
                >
                    excellence
                </span>
            </h2>

            <p className="max-w-3xl text-center text-surface/80 text-lg md:text-xl font-medium leading-relaxed px-6 mb-8 md:mb-12 z-10" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Ice-Tech is an established ice cream brand with over 35 years of experience crafting fresh, creamy soft serves, shakes, and signature cones. Since 1990, the company has focused on using premium ingredients to create high-quality desserts at accessible prices across multiple locations including Gujranwala, Lahore, and Sialkot.
            </p>

            <div className="flex justify-center items-center w-full relative z-20 hover:scale-[1.03] transition-transform duration-500 ease-out will-change-transform">
              <button 
                  ref={btnRef} 
                  className="relative group bg-surface-container-lowest rounded-full md:rounded-[50px] overflow-hidden py-4 md:py-6 px-10 md:px-16 z-30 flex items-center justify-center cursor-pointer shadow-2xl border border-white/10 will-change-transform"
              >
                  <div className="absolute inset-0 bg-primary scale-0 rounded-full group-hover:scale-[2.5] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform" />
                  
                  <span className="relative z-10 font-headline font-bold text-on-surface group-hover:text-on-primary transition-colors duration-300 text-sm md:text-lg uppercase tracking-wider md:tracking-widest drop-shadow-sm">
                      Contact Us
                  </span>
              </button>
            </div>
        </section>
    </div>
  );
};

export default CTA;
