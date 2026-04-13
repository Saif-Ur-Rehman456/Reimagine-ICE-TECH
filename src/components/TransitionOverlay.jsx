import React from 'react';
import { useTransition } from '../context/TransitionContext';

const TransitionOverlay = () => {
  const { columnRefs, isTransitioning, overlayRef } = useTransition();

  return (
    <div 
      ref={overlayRef}
      className={`fixed inset-0 w-full h-full flex flex-col z-[10000] pointer-events-none ${isTransitioning ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      {[0, 1, 2, 3].map((_, i) => (
        <div
          key={i}
          ref={(el) => (columnRefs.current[i] = el)}
          className="flex-1 bg-[#1c5fdf] pointer-events-auto will-change-transform contain-paint translate-x-[-100%]"
        ></div>
      ))}
    </div>
  );
};

export default TransitionOverlay;
