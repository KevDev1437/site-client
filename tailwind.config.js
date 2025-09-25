/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
        'script': ['Great Vibes', 'cursive'],
      },
      colors: {
        'beige-clair': '#f7f3f0',
        'rose-poudre': '#f4e6e6',
        'dore-doux': '#d4af8c',
        'dore-fonce': '#b8946a',
        'gris-doux': '#8b8680',
        'blanc-creme': '#faf8f5',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
