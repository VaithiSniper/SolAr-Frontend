// default settings can be found here
// https://unpkg.com/browse/tailwindcss@2.2.17/stubs/defaultConfig.stub.js

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        lg: "200px",
      },
      fontFamily: {
        heading: ["Harmoneux", "monospace"],
        sub: ["Inter", "serif"],
        space: ["Space Grotesk"],
      },
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
        "6xl": "3.560rem",
        "7xl": "3.6rem",
        banner: "5.560rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
