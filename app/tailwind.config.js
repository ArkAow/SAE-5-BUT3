// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#B51621",
        primaryshade: "#800911",
        primarytint: "#CB5B63",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      backgroundImage: {
        'landscape': "url('../public/images/paysage.png')",
        'pfp': "url('../public/images/profile_picture_anonym.png')",
      }
    },
  },
  plugins: [],
};
