/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0D0835',
        orange: '#FF6B35',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'author': ['Author', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
