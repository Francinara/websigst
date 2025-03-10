/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      },
      colors: {
        green: {
          700: "#006400",
          200: "#90a36c",
        },
        blue: {
          700: "#071d41",
        },
      },
    },
  },
  plugins: [],
};
