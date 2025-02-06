/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    './src/**/*.{html,js}',
    './src/*.{html,js}',
    './src/components/**/*.{html,js}',
  ],
  theme : {
    extend: {
      colors: {
        "d1": '#202C39',
        // "d2": "#266e76",
        // "l1": "#dbe6e7 ", /* primary */
        "l1": "#D8B589", /* primary */
        "d2": "#D8B589 ",
        "l2": "#e7e7e9", /* background */
        "l3": "#418788",
      },
    }
  },
  plugins: []
  // ... rest of your config
}

