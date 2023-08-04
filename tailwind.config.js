/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#115BEE',
        'primary-d': '#6B9DFF',
      }
    },
  },
  plugins: [],
}

