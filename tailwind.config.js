
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': 'var(--font-body)',
        'serif': 'var(--font-heading)',
        'heading': 'var(--font-heading)',
        'body': 'var(--font-body)',
      },
      colors: {
        'rich-black': '#748873',
        'camel': '#D1A980',
        'platinum': '#E5E0D8',
        'white-smoke': '#F8F8F8',
        'forest': {
          50: '#f0f4f0',
          100: '#d9e5d6',
          200: '#b8d1b0',
          300: '#92b885',
          400: '#748873',
          500: '#5a6b58',
          600: '#475447',
          700: '#364136',
          800: '#252e25',
          900: '#141a14'
        },
        'earth': {
          50: '#faf8f4',
          100: '#f2ede1',
          200: '#e8dcc4',
          300: '#dcc7a0',
          400: '#D1A980',
          500: '#b8935f',
          600: '#9d7a47',
          700: '#7d6138',
          800: '#5c472a',
          900: '#3d2f1c'
        },
        'stone': {
          50: '#F8F8F8',
          100: '#f1f1f1',
          200: '#E5E0D8',
          300: '#d4cfc5',
          400: '#b8b3a8',
          500: '#9c978c',
          600: '#7a756a',
          700: '#5a5650',
          800: '#3a3836',
          900: '#1a1918'
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(116, 136, 115, 0.1), 0 4px 6px -2px rgba(116, 136, 115, 0.05)',
        'medium': '0 4px 25px -5px rgba(116, 136, 115, 0.15), 0 10px 10px -5px rgba(116, 136, 115, 0.04)'
      }
    },
  },
  plugins: [],
}
