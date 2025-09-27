/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0D0835',
        orange: '#FF6B35',
        dark_purple: '#5D2E5F',
        light_purple: '#B18BBB',
        light_blue: '#437C90',
        white: '#FEF9EF',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'author': ['Author', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
