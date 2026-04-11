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
        "error-container": "#93000a",
        "secondary": "#c0c1ff",
        "on-primary-fixed": "#23005c",
        "on-primary-fixed-variant": "#5516be",
        "tertiary-container": "#e14ef6",
        "on-secondary-fixed": "#07006c",
        "on-surface": "#e4e1ec",
        "surface-tint": "#d0bcff",
        "on-tertiary-container": "#4d0059",
        "on-error-container": "#ffdad6",
        "on-tertiary-fixed": "#36003e",
        "on-secondary-fixed-variant": "#2f2ebe",
        "tertiary-fixed-dim": "#fbabff",
        "secondary-fixed-dim": "#c0c1ff",
        "primary-fixed": "#e9ddff",
        "tertiary-fixed": "#ffd6fd",
        "on-surface-variant": "#cbc3d7",
        "surface": "#13131a",
        "secondary-fixed": "#e1e0ff",
        "primary-fixed-dim": "#d0bcff",
        "surface-container-highest": "#34343c",
        "inverse-primary": "#6d3bd7",
        "on-tertiary": "#580065",
        "surface-container-low": "#1b1b22",
        "tertiary": "#fbabff",
        "surface-variant": "#34343c",
        "on-secondary-container": "#b0b2ff",
        "primary-container": "#a078ff",
        "error": "#ffb4ab",
        "on-primary-container": "#340080",
        "outline": "#958ea0",
        "surface-dim": "#13131a",
        "inverse-surface": "#e4e1ec",
        "surface-container-high": "#2a2931",
        "surface-container-lowest": "#0e0e15",
        "background": "#13131a",
        "on-primary": "#3c0091",
        "on-tertiary-fixed-variant": "#7c008e",
        "surface-bright": "#393841",
        "on-secondary": "#1000a9",
        "on-error": "#690005",
        "outline-variant": "#494454",
        "primary": "#d0bcff",
        "surface-container": "#1f1f26",
        "secondary-container": "#3131c0",
        "inverse-on-surface": "#303038",
        "on-background": "#e4e1ec"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "plus-jakarta": ["Plus Jakarta Sans", "sans-serif"],
        "inter": ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
