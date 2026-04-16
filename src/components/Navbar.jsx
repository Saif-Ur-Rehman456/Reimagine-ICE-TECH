import React from 'react';
import { useLenis } from 'lenis/react';
import { useTransition } from '../context/TransitionContext';

const Navbar = () => {
  const { playTransition } = useTransition();
  const lenis = useLenis();

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#portfolio' },
    { name: 'Contact', href: '#footer' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (!lenis) return;
    
    playTransition(() => {
      setTimeout(() => {
        lenis.scrollTo(href, { immediate: true });          
      }, 1000);
    });
  };

  const handleInquiryClick = (e) => {
    e.preventDefault();
    if (!lenis) return;
    lenis.scrollTo('#footer');
  };

  return (
    <nav
      aria-label="ICE-TECH primary site navigation"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[96%] sm:w-[90%] max-w-[1000px] pointer-events-auto"
    >
      <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-1.5 bg-[#EFFBFF]/95 backdrop-blur-md border border-gray-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        
        <div className="flex items-center flex-shrink-0 mr-4 sm:mr-0 pl-1 sm:pl-0" role="img" aria-label="ICE-TECH logo">
            <img src="assets/logo.webp" alt="ICE TECH Logo" className="h-5 sm:h-8 object-contain" />
        </div>

        <div className="flex-1 overflow-x-auto hide-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          <ul className="flex items-center justify-start sm:justify-center gap-4 sm:gap-12 min-w-max">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-gray-800 hover:text-primary transition-colors py-1"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button 
            onClick={handleInquiryClick}
            className="hidden lg:flex ml-4 items-center flex-shrink-0 gap-2 bg-primary hover:bg-primary/90 transition-colors text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md"
        >
            Inquiry
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;