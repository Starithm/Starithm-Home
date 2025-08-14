/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'starithm-electric-violet': '#8D0FF5',
        'starithm-veronica': '#A239CA',
        'starithm-selective-yellow': '#FFB400',
        'starithm-rich-black': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
