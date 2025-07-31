import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        highlight: {
          "50": "hsl(var(--color-accents-one) / <alpha-value>)",
          "100": "hsl(var(--color-accents-two) / <alpha-value>)",
        },
        contrast: {
          verylight: "hsl(var(--color-contrast-verylight) / <alpha-value>)",
          light: "hsl(var(--color-contrast-light) / <alpha-value>)",
          neutral: "hsl(var(--color-contrast-neutral) / <alpha-value>)",
          semidark: "hsl(var(--color-contrast-semidark) / <alpha-value>)",
          dark: "hsl(var(--color-contrast-dark) / <alpha-value>)",
          verydark: "hsl(var(--color-contrast-verydark) / <alpha-value>)",
        },
        tc: {
          DEFAULT: "hsl(var(--color-text-normal) / <alpha-value>)",
          muted: "hsl(var(--color-text-muted) / <alpha-value>)",
          disabled: "hsl(var(--color-text-disabled) / <alpha-value>)",
          contrast: "hsl(var(--color-text-contrast) / <alpha-value>)",
        },
        danger: {
          none: "hsl(var(--color-danger-none) / <alpha-value>)",
          low: "hsl(var( --color-danger-low) / <alpha-value>)",
          mid: "hsl(var(--color-danger-mid) / <alpha-value>)",
          high: "hsl(var(--color-danger-high) / <alpha-value>)",
          critical: "hsl(var(--color-danger-critical) / <alpha-value>)",
        },
        shakespeare: {
          DEFAULT: "hsl(196 62% 54%)",
          "50": "hsl(189 68% 96%)",
          "100": "hsl(193 67% 90%)",
          "200": "hsl(195 68% 82%)",
          "300": "hsl(195 67% 69%)",
          "400": "hsl(196 62% 54%)",
          "500": "hsl(197 68% 43%)",
          "600": "hsl(200 66% 36%)",
          "700": "hsl(201 59% 31%)",
          "800": "hsl(203 51% 27%)",
          "900": "hsl(205 45% 24%)",
          "950": "hsl(206 58% 15%)",
        },
        shamrock: {
          DEFAULT: "hsl(162 65% 55%)",
          "50": "	hsl(155 81% 96%)",
          "100": "hsl(152 80% 90%)",
          "200": "hsl(156 76% 80%)",
          "300": "hsl(160 72% 67%)",
          "400": "hsl(162 65% 55%)",
          "500": "hsl(164 85% 39%)",
          "600": "hsl(165 94% 30%)",
          "700": "hsl(167 94% 24%)",
          "800": "hsl(167 88% 20%)",
          "900": "hsl(168 86% 16%)",
          "950": "hsl(169 91% 9%)",
        },
        carnation: {
          DEFAULT: "hsl(0, 93%, 60%)",
          "50": "hsl(0, 100%, 97%)",
          "100": "hsl(0, 100%, 94%)",
          "200": "hsl(0, 100%, 89%)",
          "300": "hsl(0, 100%, 81%)",
          "400": "hsl(0, 100%, 68%)",
          "500": "hsl(0, 93%, 60%)",
          "600": "hsl(0, 79%, 51%)",
          "700": "hsl(0, 81%, 42%)",
          "800": "hsl(0, 78%, 35%)",
          "900": "hsl(0, 69%, 31%)",
          "950": "hsl(0, 82%, 15%)",
        },
      },
      dropShadow: {
        "soft-1": "0 7px 20px rgba(40, 41, 61, 0.08)",
        "soft-2": "0 0px 18px rgba(0, 0, 0, 0.15)",
        "soft-3": "0 4px 4px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fade: {
          from: { opacity: "1" },
          to: {
            opacity: "0",
          },
        },
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
        vanish: "fade 0s ease-in-out 5s forwards",
        "reverse-spin": "reverse-spin 1s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
