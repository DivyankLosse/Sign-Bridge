import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#111218",
        surface: "#181922",
        "surface-soft": "#20212d",
        "surface-strong": "#2a2b3a",
        primary: "#8B5CF6",
        "primary-strong": "#7C3AED",
        secondary: "#6366F1",
        tertiary: "#D946EF",
        accent: "#C084FC",
        ink: "#F4F1FF",
        muted: "#C9C2DA",
        subtle: "#8D86A3",
        outline: "#3A344C",
        danger: "#FF7A90",
        "danger-soft": "#331B2A",
        "on-surface": "#F4F1FF",
        "on-background": "#F4F1FF",
        "on-surface-variant": "#C9C2DA",
        "surface-container-lowest": "#0A0A12",
        "surface-container-low": "#14151E",
        "surface-container": "#1B1C26",
        "surface-container-high": "#242534",
        "surface-container-highest": "#302B42",
        "surface-variant": "#302B42",
        "outline-variant": "#3A344C",
        "primary-container": "#8B5CF6",
        "secondary-container": "#6366F1",
        "on-primary-fixed": "#120826",
        "on-primary-container": "#120826"
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.5rem",
        "xl": "0.5rem",
        "full": "9999px"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.28)",
        lift: "0 18px 40px rgba(139, 92, 246, 0.18)"
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
