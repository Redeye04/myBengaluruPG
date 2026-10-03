/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        edu: ['"Edu QLD Hand"', 'cursive'],
        saira: ['"Saira Extra Condensed"', 'sans-serif'],
      },
      colors: {
        charcoal:  '#2C3539',
        slate:     '#54626F',
        teal:      '#36626A',
        deepgreen: '#214F56',
        terracotta:'#C06E52',
        sage:      '#9CAF88',
        sandstone: '#D4BE9E',
      },
    },
  },
  plugins: [],
};
