/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F3',
          100: '#F6F0E7',
          200: '#EDE3D5',
          300: '#E0D1BE',
        },
        espresso: {
          50: '#F5F0EC',
          100: '#E7DBD2',
          200: '#D2BFB2',
          300: '#B39A88',
          500: '#7A5C4B',
          700: '#4A342A',
          800: '#38251D',
          900: '#2A1B15',
        },
        caramel: {
          50: '#FDF6EF',
          100: '#FBEBDD',
          200: '#F5D6BB',
          300: '#EDB98C',
          500: '#D98E4A',
          600: '#C57A37',
          700: '#A86228',
        },
        matcha: {
          50: '#F2F6F0',
          100: '#E8EFE4',
          300: '#B9CBAC',
          500: '#7E9B6E',
          700: '#55704A',
        },
        berry: {
          50: '#FDF2F2',
          100: '#FBE6E6',
          300: '#E8AFAF',
          500: '#C25B5B',
          700: '#9C3F3F',
        },
        honey: {
          50: '#FEF9E9',
          100: '#FDF2D0',
          300: '#F2D883',
          500: '#D9A521',
          700: '#A97C12',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(42, 27, 21, 0.04), 0 12px 32px -18px rgba(42, 27, 21, 0.22)',
        lift: '0 18px 48px -22px rgba(42, 27, 21, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'slide-up': 'slide-up 220ms ease-out',
      },
    },
  },
  plugins: [],
};
