import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      colors: {
        herb: {
          dark: '#0a0812',
          surface: '#0e1220',
          card: '#121830',
          sage: '#9cb59d',
          sageDark: '#5c7c5d',
          accent: '#c17f59',
          honey: '#d4a853',
          gold: '#d4a853',
          goldLight: '#e8c97a',
          navy: '#0a1535',
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d4a853 0%, #e8c97a 50%, #d4a853 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
