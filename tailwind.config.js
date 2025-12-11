/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Red for dark mode
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        orange: {
          // Orange for light mode
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wink: {
          '0%': { transform: 'scaleY(1)' },
          '40%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1)' },
        },
        introWink: {
          '0%': { transform: 'scaleY(1)' },
          '40%': { transform: 'scaleY(0.25)' },
          '100%': { transform: 'scaleY(1)' },
        },
        introFade: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.96)' },
        },
      },
      animation: {
        floatIn: 'floatIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        wink: 'wink 0.25s ease-in-out forwards',
        introWink: 'introWink 0.25s ease-in-out forwards',
        introFade: 'introFade 0.8s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}

