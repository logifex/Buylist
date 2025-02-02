/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#fb923c",
          500: "#F57C00",
          600: "#d97706",
        },
        background: "#f2f2f2",
        dark: {
          background: "#010101",
          main: {
            400: "#858585",
            500: "#696969",
            600: "#4f4f4f",
            700: "#363636",
            800: "#1e1e1e",
          },
        },
      },
    },
  },
  plugins: [],
};
