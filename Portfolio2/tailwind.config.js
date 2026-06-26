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
      },
      animation: {
        float:             'float 3s ease-in-out infinite',
        'float-delay':     'float 3s ease-in-out 1.5s infinite',
        'gradient-shift':  'gradientShift 18s ease infinite',
        'fade-in-up':      'fadeInUp 0.6s ease-out forwards',
        'progress-fill':   'progressFill 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
