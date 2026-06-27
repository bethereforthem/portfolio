/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        progressFill: {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'scroll-dot': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%':       { transform: 'translateY(10px)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%':       { transform: 'translate(25px, -18px)' },
          '66%':       { transform: 'translate(-12px, 22px)' },
        },
      },
      animation: {
        float:             'float 3s ease-in-out infinite',
        'float-delay':     'float 3s ease-in-out 1.5s infinite',
        'gradient-shift':  'gradientShift 18s ease infinite',
        'fade-in-up':      'fadeInUp 0.6s ease-out forwards',
        'progress-fill':   'progressFill 1.2s ease-out forwards',
        marquee:           'marquee 30s linear infinite',
        'scroll-dot':      'scroll-dot 1.6s ease-in-out infinite',
        'drift':           'drift 18s ease-in-out infinite',
        'drift-slow':      'drift 24s ease-in-out 6s infinite',
      },
    },
  },
  plugins: [],
}
