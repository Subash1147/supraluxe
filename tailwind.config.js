/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        // Luxury color palette for Supraluxe
        luxury: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4df',
          300: '#d4ccc4',
          400: '#b8ada4',
          500: '#a89999',
          600: '#8b7b77',
          700: '#6b5f5a',
          800: '#4a423d',
          900: '#2a2420',
        },
        gold: {
          50: '#fffbf0',
          100: '#fff8e7',
          200: '#ffefd1',
          300: '#ffe4b5',
          400: '#ffd699',
          500: '#d4a574',
          600: '#b89456',
          700: '#a0863f',
          800: '#8b7836',
          900: '#6b5f2f',
        },
        charcoal: '#2c2c2c',
        cream: '#f5f3f0',
        slate: '#3e3e3e',
      },
    },
  },
  plugins: [],
}

