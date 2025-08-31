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
        'starithm-veronica-dark': '#C84BF7',
        
        // CSS Variables for theme support
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        'sans': ['Google Sans Code', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
