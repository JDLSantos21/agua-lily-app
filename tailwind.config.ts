import type { Config } from "tailwindcss";

//añadir fuente oswald

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        dots: "dots 1.5s steps(3, end) infinite",
      },
      keyframes: {
        dots: {
          "0%": { content: '""' },
          "33%": { content: '"."' },
          "66%": { content: '".."' },
          "100%": { content: '"..."' },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        subheading: ["var(--font-subheading)"],
        body: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
        // Mantener compatibilidad con clases existentes
        Oswald: ["Oswald", "sans-serif"],
        Liter: ["Liter", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        comfortaa: ["Comfortaa", "sans-serif"],
      },
      fontSize: {
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        h4: "var(--text-h4)",
        h5: "var(--text-h5)",
        base: "var(--text-base)",
        sm: "var(--text-sm)",
        xs: "var(--text-xs)",
      },
      textColor: {
        "muted-foreground": "var(--muted-foreground)",
        muted: "var(--muted)",
      },
      fontWeight: {
        light: "var(--font-light)",
        normal: "var(--font-normal)",
        medium: "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold: "var(--font-bold)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
