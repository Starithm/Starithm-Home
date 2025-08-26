/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'starithm-electric-violet': '#8D0FF5',
        'starithm-veronica': '#6B46C1',
        'starithm-selective-yellow': '#FFC332',
        'starithm-rich-black': '#1A1A1A',
        'starithm-platinum': '#E7DFDD',
        'starithm-bg-black': '#0E0B16',
        'starithm-electric-violet-dark': '#9A48FF',
        'starithm-veronica-dark': '#C84BF7'
      },
      fontFamily: {
        'sans': ['Google Sans Code', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
