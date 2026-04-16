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
    
    // Play transition overlay
    playTransition(() => {
      setTimeout(() => {
        lenis.scrollTo(href, { immediate: true });          
        
      }, 1000);
        // Jump to section instantly while screen is totally covered
    });
  };

  const handleInquiryClick = (e) => {
    e.preventDefault();
    if (!lenis) return;
    // Inquiry remains instant with NO transition as requested earlier
    lenis.scrollTo('#footer');
  };

  return (
    <nav
      aria-label="ICE-TECH primary site navigation"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[1000px] pointer-events-auto"
    >
      {/* Wrapper with reduced vertical padding for standard height */}
      <div className="flex items-center justify-between px-8 py-1.5 bg-[#EFFBFF] border border-gray-200 rounded-full shadow-lg">
        {/* Logo / Brand */}
        <div className="flex items-center" role="img" aria-label="ICE-TECH logo">
            <img src="assets/logo.webp" alt="ICE TECH Logo" className="h-6 sm:h-8 object-contain" />
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6 sm:gap-12">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-gray-800"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button - No transition as per previous requirement */}
        <button 
            onClick={handleInquiryClick}
            className="hidden md:flex ml-4 items-center gap-2 bg-[#1c5fdf] text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
        >
            Inquiry
            
        </button>
      </div>
    </nav>
  );
};

export default Navbar;