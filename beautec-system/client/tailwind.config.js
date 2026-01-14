/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // Violet
        secondary: '#ec4899', // Pink
        dark: '#111827', // Gray 900
        glass: 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
