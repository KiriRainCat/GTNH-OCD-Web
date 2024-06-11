/** @type {import('tailwindcss').Config} */

import { presetVarlet } from "@varlet/preset-tailwindcss";

// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  presets: [presetVarlet()],
  theme: {
    extend: {},
  },
  plugins: [],
};
