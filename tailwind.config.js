/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        accentBlue: '#3b82f6',
        errorYellow: '#eab308',
      }
    },
  },
  plugins: [],
}
