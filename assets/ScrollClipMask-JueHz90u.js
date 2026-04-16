import{r as i,j as e}from"./vendor-react-DrozfwT6.js";import{u as g,g as m,S as x}from"./vendor-gsap-D9Nw-LlZ.js";import{u as w}from"./index-BUjtNjuB.js";import"./vendor-lenis-D44dO8om.js";const R=()=>{const r=i.useRef(null),s=i.useRef(null),n=i.useRef(null),l=i.useRef(null),o=w();g(()=>{if(!r.current||!s.current)return;const t=window.innerWidth<=768||/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);if(o||t)return;const a=m.timeline({scrollTrigger:{trigger:r.current,start:"top top",end:"+=180%",pin:s.current,pinSpacing:!0,scrub:1.5,invalidateOnRefresh:!0,refreshPriority:-1}});a.fromTo(n.current,{clipPath:"inset(0% 0% 0% 0% round 0px)"},{clipPath:"inset(20% 20% 20% 20% round 48px)",ease:"power2.inOut"},0),a.fromTo(l.current,{scale:1},{scale:1.1,ease:"power2.inOut"},0),m.fromTo(".marquee-wrapper",{opacity:.4},{opacity:1,scrollTrigger:{trigger:r.current,start:"top top",end:"center center",scrub:!0}}),x.refresh()},{scope:r,dependencies:[o]});const u=["BRIGHT","*","PRODUCTS","*","ALWAYS","*","NATURALLY","*","WE","*"],f=[0,1,2];return e.jsxs("section",{ref:r,"aria-label":"ICE-TECH Premium Quality showcase",className:"relative w-full overflow-hidden",style:{zIndex:10,backgroundColor:"#FDF1E1"},children:[e.jsx("style",{children:`
        @keyframes infinite-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll var(--duration, 40s) linear infinite;
          will-change: transform;
        }
        
        /* Mobile Specific Layout: No masking, simple static appearance */
        @media (max-width: 768px) {
          .mobile-static-mask {
            clip-path: inset(10% 10% 10% 10% round 24px) !important;
          }
          .mobile-static-marquee {
            opacity: 1 !important;
          }
        }
      `}),e.jsxs("div",{ref:s,className:"relative h-screen w-full overflow-hidden flex items-center justify-center",style:{backgroundColor:"#FDF1E1"},children:[e.jsx("div",{"aria-hidden":"true",className:"marquee-wrapper mobile-static-marquee absolute inset-0 z-0 flex flex-col justify-center pb-[5vh] pointer-events-none select-none overflow-hidden origin-center rotate-[-6deg] scale-125",children:e.jsx("div",{className:"flex flex-col gap-2",children:f.map(t=>e.jsx("div",{className:"flex whitespace-nowrap",style:{fontFamily:'"Plus Jakarta Sans", sans-serif',fontWeight:900,fontSize:"8.5vw",lineHeight:"1.3",color:"#9F142D",textTransform:"uppercase",letterSpacing:"-0.04em"},children:e.jsx("div",{className:"flex animate-infinite-scroll h-full items-center",style:{"--duration":`${30+t*10}s`},children:[...Array(2)].map((a,p)=>e.jsx("div",{className:"flex flex-shrink-0 items-center",children:u.map((d,c)=>{const h=(c+t)%2!==0;return e.jsx("span",{className:"px-3",style:h?{WebkitTextStroke:"1.5px #9F142D",color:"transparent"}:{},children:d},c)})},p))})},t))})}),e.jsx("div",{ref:n,className:"relative z-10 w-full h-full mobile-static-mask",style:{willChange:"clip-path"},children:e.jsx("img",{ref:l,src:"assets/im2.webp",alt:"ICE-TECH premium ice cream product — creamy soft serve in a cone",width:1920,height:1080,className:"w-full h-full object-cover",loading:"eager",fetchPriority:"high",decoding:"async",style:{willChange:"transform"}})})]})]})};export{R as default};
