import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#b91c1c",
        "primary-hover": "#991b1b",
        "background-light": "#fcf8ef",
        "background-dark": "#121212",
        "sidebar-light": "#f7f2e4",
        "sidebar-dark": "#0a0a0a",
        "card-light": "#ffffff",
        "card-dark": "#1e1e1e",
        "text-light": "#e0dcc8",
        "parchment-dark": "#121212",
        "ink": "#3e3232",
        "ink-light": "#706464",
        "stone": {
          50: '#faf7f0',
          100: '#f5efe1',
          200: '#e6dec8',
          300: '#d1c4a8',
          400: '#a3967d',
          500: '#7d705a',
          600: '#635848',
          800: '#423b32',
          900: '#2b2621',
        },
        "border-vintage": "#e3dac6",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "serif": ["Noto Serif", "serif"],
      },
      boxShadow: {
        'paper': '0 2px 4px 0 rgba(60, 50, 40, 0.08), 0 1px 6px 1px rgba(60, 50, 40, 0.04)',
        'paper-hover': '0 4px 6px 0 rgba(60, 50, 40, 0.12), 0 8px 12px 4px rgba(60, 50, 40, 0.08)',
        "stamp": "0 4px 14px 0 rgba(185, 28, 28, 0.39)",
        "folder": "1px 0px 0px 0px rgba(0,0,0,0.05) inset, -1px 0px 0px 0px rgba(0,0,0,0.05) inset, 0px 2px 4px 0px rgba(0,0,0,0.1)"
      }
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
