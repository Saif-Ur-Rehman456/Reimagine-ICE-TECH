import React from 'react';

const TechStack = () => {
  const text = "ULTRA FAST • ICE-COOL TECH • NEXT-GEN AI • PREMIUM DESIGN • ";

  const MarqueeRow = ({ isReverse }) => (
    <div className={`flex w-max relative items-center gap-6 md:gap-8 ${isReverse ? 'animate-[marquee_40s_linear_infinite_reverse]' : 'animate-[marquee_40s_linear_infinite]'}`}>
      {[...Array(4)].map((_, i) => (
        <span 
          key={i} 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[8rem] font-headline font-black whitespace-nowrap"
          style={{
            WebkitTextStroke: '1px #585c5a',
            color: 'transparent',
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-surface overflow-hidden flex flex-col gap-4 md:gap-8">
       <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-25%); }
          }
        `}
      </style>

      {/* Top row (moving left) */}
      <MarqueeRow isReverse={false} />
      
      {/* Middle row solid highlight */}
      <div className={`flex w-max relative items-center gap-6 md:gap-8 animate-[marquee_40s_linear_infinite]`}>
      {[...Array(4)].map((_, i) => (
        <span 
          key={i} 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[8rem] font-headline font-black whitespace-nowrap text-on-surface"
        >
          {text}
        </span>
      ))}
      </div>

      {/* Bottom row (moving right) */}
      <MarqueeRow isReverse={true} />
    </section>
  );
};

export default TechStack;
