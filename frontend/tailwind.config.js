/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        ink: {
          950: "#101828",
          800: "#1f2937",
          600: "#475467",
          500: "#667085",
        },
        brand: {
          50: "#eef8ff",
          100: "#d9eefc",
          500: "#2576d2",
          600: "#1d5fb8",
          700: "#184d93",
        },
        signal: {
          500: "#16a3a8",
          600: "#0d858c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
