import{j as e,r as i}from"./vendor-react-DrozfwT6.js";const t=[{id:1,name:"RASPBERRY MOCHI",tagline:"Fruit explosion.",image:"assets/img1.webp",price:"$5.99",alt:"Raspberry Mochi ice cream — fresh fruit-flavoured mochi from ICE-TECH"},{id:2,name:"MANGO PASSION",tagline:"Tropical delight.",image:"assets/img3.webp",price:"$6.49",alt:"Mango Passion Fruit Mochi ice cream — tropical ICE-TECH specialty"},{id:3,name:"PISTACHIO RASPBERRY",tagline:"Nutty fresh.",image:"assets/img4.webp",price:"$6.99",alt:"Pistachio Raspberry Mochi ice cream by ICE-TECH"},{id:4,name:"CHOCOLATE MOCHI",tagline:"Dark & rich.",image:"assets/img5.webp",price:"$7.49",alt:"Chocolate Mochi ice cream — dark and rich ICE-TECH creation"},{id:5,name:"CLASSIC BAR",tagline:"Pure chocolate.",image:"assets/img6.webp",price:"$5.49",alt:"Classic Chocolate Ice Cream Bar by ICE-TECH"},{id:6,name:"DOUBLE CHOC BAR",tagline:"Triple Layered.",image:"assets/img7.webp",price:"$6.99",alt:"Double Chocolate Ice Cream Bar — triple layered by ICE-TECH"},{id:7,name:"STRAWBERRY BAR",tagline:"Summer vibes.",image:"assets/img8.webp",price:"$5.99",alt:"Strawberry Cream Ice Cream Bar — summer edition by ICE-TECH"},{id:8,name:"VANILLA DREAM",tagline:"Elegance redefined.",image:"assets/img9.png",price:"$5.99",alt:"Vanilla Dream ice cream — elegantly crafted by ICE-TECH"}],n=[...t,...t],l=`
  @keyframes products-marquee {
    0%   { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
  .products-marquee-track {
    animation: products-marquee 25s linear infinite;
    will-change: transform;
  }
  @media (max-width: 768px) {
    .products-marquee-track {
      animation-duration: 35s; /* Slower on mobile */
    }
  }
  .products-marquee-track:hover {
    animation-play-state: paused;
  }
  
  /* Pure CSS 3D emulation & hover effect - no JS needed! */
  .product-card {
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
  }
  .product-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    z-index: 10;
  }
`,r=i.memo(({product:a})=>e.jsxs("article",{"aria-label":`${a.name} — ${a.price}`,className:"product-card relative flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] h-[60vh] sm:h-[65vh] md:h-[70vh] rounded-[2.5rem] overflow-hidden group mr-6 sm:mr-8 md:mr-10 select-none isolate bg-surface-container",style:{minWidth:"280px",minHeight:"320px"},children:[e.jsx("img",{src:a.image,alt:a.alt,width:600,height:800,className:"w-full h-full object-cover transition-[filter,transform] duration-700 brightness-[0.85] group-hover:brightness-110 group-hover:scale-105 will-change-transform block",loading:"lazy",decoding:"async"}),e.jsx("div",{"aria-hidden":"true",className:"absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none select-none z-10 transition-opacity duration-500 group-hover:opacity-80"}),e.jsxs("div",{className:"absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end pointer-events-none z-20",children:[e.jsx("h3",{className:"font-headline text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-1 drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-1",children:a.name}),e.jsxs("div",{className:"flex justify-between items-end drop-shadow-md",children:[e.jsx("p",{className:"font-body text-white/80 text-xs md:text-sm uppercase tracking-widest font-bold",children:a.tagline}),e.jsx("span",{className:"font-headline text-lg md:text-xl font-bold text-white text-shadow-sm",children:a.price})]})]})]}));r.displayName="ProductCard";const c=()=>e.jsxs("section",{"aria-label":"ICE-TECH Most Popular Ice Cream Collection",className:"bg-surface py-20 md:py-32 overflow-hidden relative z-20 contain-paint",children:[e.jsx("style",{children:l}),e.jsxs("div",{className:"px-6 sm:px-12 md:px-20 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-30",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-primary font-label text-sm font-bold tracking-[0.3em] uppercase mb-3 block",children:"Most Popular"}),e.jsxs("h2",{className:"font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tighter leading-[0.9]",children:["INFINITE ",e.jsx("br",{}),e.jsxs("span",{className:"text-surface-container-highest flex items-center gap-4",children:["FLAVORS",e.jsx("div",{"aria-hidden":"true",className:"h-1 w-12 sm:w-20 md:w-40 bg-primary/20 rounded-full hidden sm:block"})]})]})]}),e.jsx("p",{className:"font-body text-on-surface-variant max-w-sm text-sm md:text-base font-medium uppercase tracking-wider leading-relaxed",children:"Our best-selling collection, designed for those who never settle for anything less than extraordinary."})]}),e.jsx("div",{className:"products-marquee-track flex items-center w-max px-6 sm:px-12 md:px-20 contain-layout","aria-hidden":"true",children:n.map((a,s)=>e.jsx(r,{product:a},`${a.id}-${s}`))}),e.jsx("div",{"aria-hidden":"true",className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-on-surface/[0.03] select-none pointer-events-none z-0 whitespace-nowrap",children:"POPULAR COLLECTION"})]});export{c as default};
