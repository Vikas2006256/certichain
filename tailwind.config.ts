import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#080D1B",
          dark: "#101A30",
          secondary: "#121E35",
        },
        navy: {
          950: "#080D1B",
          900: "#0D1527",
          850: "#101A30",
          800: "#121E35",
          700: "#1A2B4C",
        },
        glass: {
          50: "rgba(255, 255, 255, 0.03)",
          100: "rgba(255, 255, 255, 0.06)",
          200: "rgba(255, 255, 255, 0.09)",
          300: "rgba(255, 255, 255, 0.15)",
          border: "rgba(255, 255, 255, 0.12)",
          borderLight: "rgba(255, 255, 255, 0.18)",
        },
        accent: {
          blue: "#3B82F6",
          cyan: "#22D3EE",
          purple: "#8B5CF6",
          emerald: "#10B981",
        },
        status: {
          verified: "#22C55E",
          pending: "#F59E0B",
          revoked: "#EF4444",
        },
      },
      backdropBlur: {
        xs: "2px",
        glass: "18px",
        heavy: "28px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glowBlue: "0 0 25px -5px rgba(59, 130, 246, 0.5)",
        glowCyan: "0 0 25px -5px rgba(34, 211, 238, 0.5)",
        glowPurple: "0 0 25px -5px rgba(139, 92, 246, 0.5)",
        glowSuccess: "0 0 25px -5px rgba(34, 197, 94, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
