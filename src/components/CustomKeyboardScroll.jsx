import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

const CustomKeyboardScroll = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing
      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      const SCROLL_STEP = 215; // Precisely calibrated step
      const windowHeight = window.innerHeight;
      let scrollAmount = 0;

      // targetScroll stores the intended destination, allowing stacking of keypresses
      const currentScroll = lenis.targetScroll !== undefined ? lenis.targetScroll : lenis.scroll;

      switch (e.key) {
        case 'ArrowUp':
          scrollAmount = -SCROLL_STEP;
          break;
        case 'ArrowDown':
          scrollAmount = SCROLL_STEP;
          break;
        case 'PageUp':
          scrollAmount = -windowHeight * 0.8; // Standard page scroll usually offsets slightly
          break;
        case 'PageDown':
          scrollAmount = windowHeight * 0.8;
          break;
        case ' ': // Spacebar
          scrollAmount = e.shiftKey ? -windowHeight * 0.8 : windowHeight * 0.8;
          break;
        case 'Home':
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          return;
        case 'End':
          e.preventDefault();
          lenis.scrollTo(document.body.scrollHeight, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          return;
        default:
          return; // Let native browser handle other keys
      }

      e.preventDefault();
      
      lenis.scrollTo(currentScroll + scrollAmount, {
        duration: 1.5, // Even smoother/longer transition
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lenis]);

  return null;
};

export default CustomKeyboardScroll;
