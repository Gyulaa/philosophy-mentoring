/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // make sure your files are scanned
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
