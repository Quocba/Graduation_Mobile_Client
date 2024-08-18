/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#75D4FF",
        secondary: {
          DEFAULT: "#09AAEE",
          600: "#0270C7",
        },
      },
    },
  },
  plugins: [],
};
