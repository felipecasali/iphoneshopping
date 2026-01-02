/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nova paleta de branding
        primary: {
          50: '#e8f1f5',
          100: '#d1e3eb',
          200: '#a3c7d7',
          300: '#75abc3',
          400: '#478faf',
          500: '#1F3A5F', // Azul profundo principal
          600: '#0B3C5D', // Azul profundo escuro
          700: '#092e47',
          800: '#072131',
          900: '#05131b',
          DEFAULT: '#1F3A5F',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#bababa',
          400: '#a3a3a3',
          500: '#4A4A4A', // Cinza grafite
          600: '#2E2E2E', // Cinza grafite escuro
          700: '#232323',
          800: '#181818',
          900: '#0d0d0d',
          DEFAULT: '#4A4A4A',
        },
        accent: {
          50: '#e6faf1',
          100: '#ccf5e3',
          200: '#99ebc7',
          300: '#66e1ab',
          400: '#33d78f',
          500: '#2ECC71', // Verde técnico (verificado/ok)
          600: '#25a35a',
          700: '#1c7a44',
          800: '#13522d',
          900: '#0a2917',
          DEFAULT: '#2ECC71',
        },
        cyan: {
          50: '#e6f7fc',
          100: '#cceff9',
          200: '#99dff3',
          300: '#66cfed',
          400: '#33bfe7',
          500: '#00B4D8', // Ciano (tecnologia/precisão)
          600: '#0090ad',
          700: '#006c82',
          800: '#004856',
          900: '#00242b',
          DEFAULT: '#00B4D8',
        },
        background: {
          DEFAULT: '#F7F9FB', // Off-white
          dark: '#0B3C5D',
        }
      },
    },
  },
  plugins: [],
}
