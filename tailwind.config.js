/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Text: ['"Source Sans 3"', 'sans-serif'],
        Titles: ['"DM Serif Display"', 'exportserif']
      },
      fontSize: {
        forma_ro_text: ["16px", { lineHeight: "24px" }],
        forma_ro_btn: ["18px", { lineHeight: "28px" }],
        forma_ro_h1: ["42px", { lineHeight: "48px" }]
      },
      colors: {
        forma_ro_black: "#1e1e1e",
        forma_ro_light_grey: "#D9D9D9"
      },
      backgroundColor: {
        forma_ro_green: "#8A987A",
        forma_ro_red: "#D58B6A",
        forma_ro_orange: "#E09F3E",
        forma_ro_grey: "#D9D1C3",
        forma_ro_light_grey: "#D9D9D9",
        forma_ro_blue: "#305369",
        forma_ro_brown: "#634622"
      },
      maxWidth: {
        width_1000: "1000px",
      },
      borderColor: {
        forma_ro_grey: "#D9D1C3",
        forma_ro_green: "#8A987A"
      }
    }

  },
  plugins: [],
};

