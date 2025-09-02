/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./microfrontends/**/src/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", ".dark"],
  theme: {
    extend: {
      colors: {
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
        // Starithm brand colors
        "starithm-rich-black": "var(--starithm-rich-black)",
        "starithm-bg-black": "var(--starithm-bg-black)",
        "starithm-platinum": "var(--starithm-platinum)",
        "starithm-electric-violet": "var(--starithm-electric-violet)",
        "starithm-veronica": "var(--starithm-veronica)",
        "starithm-selective-yellow": "var(--starithm-selective-yellow)",
        "starithm-golden-yellow": "var(--starithm-golden-yellow)",
        "starithm-electric-violet-dark": "var(--starithm-electric-violet-dark)",
        "starithm-veronica-dark": "var(--starithm-veronica-dark)",
        "starithm-link": "var(--starithm-link)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
