/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          deep: '#2C3E50',
          light: '#3498DB',
          DEFAULT: '#2C3E50'
        },
        // Alert Colors
        alert: {
          critical: '#E74C3C',
          warning: '#F39C12',
          success: '#2ECC71'
        },
        // Neutral Colors
        neutral: {
          dark: '#34495E',
          light: '#ECF0F1',
          DEFAULT: '#34495E'
        },
        // Data Colors
        data: {
          teal: '#008080',
          cyan: '#00BCD4',
          blue: '#3498DB'
        },
        'cyber-green': {
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
        'terminal-black': {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
        },
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
        glitch: 'glitch 1s ease-in-out infinite alternate',
        typing: 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        scan: 'scan 2s ease-in-out infinite',
        'virus-appear': 'virus-appear 0.3s ease forwards',
        'virus-eliminate': 'virus-eliminate 0.8s ease-in forwards',
        'bug-crawl': 'bug-crawl 4s linear infinite alternate',
        'shield-pulse': 'shield-pulse 2s ease-out',
        'scan-complete': 'scan-complete-sweep 1s ease-out',
        'data-transfer': 'data-transfer 1s ease-in forwards',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' },
          '100%': { transform: 'translate(0)' },
        },
        scan: {
          '0%': { top: '-10px' },
          '100%': { top: '100%' },
        },
        'virus-appear': {
          '0%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(45deg)' },
        },
        'virus-eliminate': {
          '0%': { opacity: '1', transform: 'scale(1) rotate(45deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2) rotate(90deg)' },
          '100%': { opacity: '0', transform: 'scale(0) rotate(180deg) translate(0, 50px)' },
        },
        'bug-crawl': {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(10px) rotate(5deg)' },
          '50%': { transform: 'translateX(20px) rotate(-5deg)' },
          '75%': { transform: 'translateX(30px) rotate(5deg)' },
          '100%': { transform: 'translateX(40px) rotate(0deg)' },
        },
        'shield-pulse': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
        'scan-complete-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
