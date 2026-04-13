/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // === New M3-inspired Design System ===
        "surface-dim": "#0a1522",
        "on-primary": "#F8FAFC",
        "on-surface": "#F8FAFC",
        "error-container": "#FF206E",
        "outline": "#1A56DB",
        "secondary-dim": "#1A56DB",
        "error": "#FF206E",
        "primary-fixed": "#1A56DB",
        "surface-container": "#0D1B2A",
        "on-error": "#F8FAFC",
        "secondary-fixed": "#1A56DB",
        "surface-container-low": "#0a1522",
        "background": "#0D1B2A",
        "inverse-primary": "#1A56DB",
        "on-secondary": "#F8FAFC",
        "surface": "#0D1B2A",
        "on-background": "#F8FAFC",
        "tertiary": "#FF206E",
        "primary": "#1A56DB",
        "on-tertiary": "#F8FAFC",
        "primary-container": "#1A56DB",
        "surface-tint": "#1A56DB",
        "surface-container-lowest": "#0D1B2A",
        "on-primary-container": "#F8FAFC",
        "inverse-surface": "#F8FAFC",
        "secondary": "#1A56DB",
        "surface-bright": "#0D1B2A",

        // === Legacy color aliases (mapped to new system) ===
        "icy-blue": "#0D1B2A",          // maps to surface/background
        "deep-ice": "#1A56DB",           // maps to primary-container
        "rich-chocolate": "#F8FAFC",     // maps to on-surface
        "velvety-mauve": "#1A56DB",      // maps to primary
        "warm-caramel": "#1A56DB",       // maps to primary
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"],
        syncopate: ["Syncopate", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        "clash-display": ["Plus Jakarta Sans", "sans-serif"],
        poppins: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px",
      },
      keyframes: {
        "sand-dissolve": {
          "0%": {
            opacity: "1",
            filter: "blur(0px)",
          },
          "50%": {
            opacity: "0.5",
            filter: "blur(2px)",
          },
          "100%": {
            opacity: "0",
            filter: "blur(8px)",
          },
        },
      },
      animation: {
        "sand-dissolve": "sand-dissolve 1.5s ease-out forwards",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
