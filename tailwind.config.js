/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00FFFF',
        neonPurple: '#C084FC',
        neonOrange: '#FDBA74',
        neonGreen: '#5EEAD4'
      }
    },
  },
  plugins: [],
}
