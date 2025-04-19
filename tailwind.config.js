/* eslint-disable import/no-anonymous-default-export */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Extend backdrop blur for glassmorphism effects
      
      // Extend colors to include all necessary shades
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
      maxWidth: {
        '10xl': '1512px',
      },
      borderRadius: {
        '5xl': '40px',
      },
      colors: {
        neutral: {
          900: '#111827',   // Darkest neutral
          800: '#1F2937',   // Matches the solid background from the image
          500: '#6B7280',   // Medium gray
          400: '#9CA3AF',   // Light gray
          300: '#D1D5DB',   // Lighter gray
          200: '#E5E7EB',   // Very light gray
        },
        red: {
          700: '#B91C1C',   // Used in hover effects
        },
        orange: {
          500: '#F97316',   // Used in hover effects
        },
      },
    },
  },
  plugins: [],
};