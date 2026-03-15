import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        accent: "#D4AF37", // Gold
        lightGray: "#F3F4F6",
      },
      keyframes: {
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1.05)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },
      animation: {
        "slide-down": "slide-down 0.3s ease-out forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0, 0, 0.2, 1) forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
      }
    },
  },
  plugins: [],
};
export default config;
