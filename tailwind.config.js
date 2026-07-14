/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fcfcf9',
          100: '#f5f3e9',
          200: '#e9e3cf',
          300: '#d7cba7',
          400: '#c1af78',
          500: '#a7924c',
          600: '#8e7939',
          700: '#71602c',
          800: '#564923',
          900: '#41371b',
          950: '#231d0b',
        },
        glass: {
          card: 'rgba(255, 255, 255, 0.45)',
          border: 'rgba(255, 255, 255, 0.25)',
          darkCard: 'rgba(15, 23, 42, 0.45)',
          darkBorder: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(31, 38, 135, 0.04)',
        'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
        'glass-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.1)',
        'glow-green': '0 0 20px 2px rgba(22, 163, 74, 0.25)',
        'glow-gold': '0 0 20px 2px rgba(218, 165, 32, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'wave-bar-1': 'wave 1.2s ease-in-out infinite 0.1s',
        'wave-bar-2': 'wave 1.2s ease-in-out infinite 0.3s',
        'wave-bar-3': 'wave 1.2s ease-in-out infinite 0.5s',
        'wave-bar-4': 'wave 1.2s ease-in-out infinite 0.2s',
        'wave-bar-5': 'wave 1.2s ease-in-out infinite 0.4s',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-delay': 'fadeIn 0.5s ease-out 0.2s forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '24px' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
