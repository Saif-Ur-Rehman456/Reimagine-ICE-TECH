import React from 'react';

// ── STEP 5: Social & nav links with real hrefs ──
// Dead '#' links waste crawl budget and trigger Google's link quality signals.
// Replace with real URLs (or at minimum meaningful anchors) before deploying.
const SOCIAL_LINKS = [
  { name: 'Instagram',   href: 'https://www.instagram.com/icetechparlour', external: true },
  { name: 'Facebook',    href: 'https://www.facebook.com/icetechparlour',  external: true },
  { name: 'Google Maps', href: 'https://maps.google.com/?q=ICE-TECH+Gujranwala', external: true },
  { name: 'Contact Us',  href: 'mailto:hello@ice-tech.com',                external: false },
];

const Footer = () => {
  return (
    // ── STEP 5: <footer> is a landmark element — Google and screen readers
    //    use it for page structure. id="footer" retained for Navbar scroll target.
    <footer
      id="footer"
      className="bg-inverse-surface text-surface flex flex-col justify-end pt-16 md:pt-24 px-6 md:px-12 pb-6 md:pb-8 overflow-hidden relative rounded-t-[3rem]"
    >
      <div className="flex flex-col md:flex-row justify-between w-full z-10 mx-auto max-w-[1400px] gap-12 md:gap-0">

        {/* ── STEP 5: <nav> landmark for social/connect links ── */}
        <nav aria-label="ICE-TECH social and contact links">
          <h4 className="font-headline font-bold uppercase tracking-wider text-xs md:text-sm text-primary-container mb-4">
            Connect
          </h4>
          <ul className="flex flex-col gap-2 md:gap-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={link.external ? `${link.name} (opens in new tab)` : link.name}
                  className="group relative inline-block text-base md:text-lg lg:text-xl font-body font-medium transition-opacity duration-300 hover:opacity-100 text-surface-dim"
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary-container origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          ── STEP 5: <address> tag for NAP data ──
          Google's local business algorithm parses <address> for NAP
          (Name, Address, Phone) signals — critical for Local SEO ranking.
          The data here should match the JSON-LD in index.html exactly.
        */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right">
          <h4 className="font-headline font-bold uppercase tracking-wider text-xs md:text-sm text-primary-container mb-4">
            Visit Us
          </h4>
          <address className="not-italic font-body font-light text-base md:text-lg mb-2 text-surface-dim">
            123 Sweet Street<br />Flavor City, CA 90210
          </address>
          <a
            href="tel:+15554232732"
            className="font-body text-inverse-primary hover:text-surface transition-colors text-sm md:text-base"
          >
            +1 (555) 423-2732
          </a>
          <a
            href="mailto:hello@ice-tech.com"
            className="font-body text-inverse-primary hover:text-surface transition-colors mt-1 text-sm md:text-base"
          >
            hello@ice-tech.com
          </a>
        </div>
      </div>

      {/*
        ── STEP 5: aria-hidden on the decorative brand watermark ──
        This is NOT the page h1 (Hero has the sr-only h1).
        The large decorative text should NOT confuse Googlebot's heading
        hierarchy or screen reader users, so we hide it from the a11y tree.
        Visually it remains exactly the same.
      */}
      <p
        aria-hidden="true"
        className="font-headline font-black text-[12vw] sm:text-[15vw] md:text-[14vw] leading-none text-center mt-16 md:mt-32 tracking-tighter select-none text-primary-container/30 w-full flex justify-center"
      >
        ICE-TECH PARLOUR
      </p>

      {/* Bottom bar */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-surface-dim/20 pt-4 md:pt-6 mt-6 md:mt-8 text-xs sm:text-sm font-body text-surface-dim/60 max-w-[1400px] mx-auto gap-4 sm:gap-0">
        <p>© {new Date().getFullYear()} ICE-TECH. All rights reserved.</p>
        <p>Crafted with Love &amp; Cold Cream</p>
      </div>
    </footer>
  );
};

export default Footer;
