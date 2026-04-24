/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        head: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          1: '#0e0e0e',
          2: '#161616',
          3: '#1e1e1e',
        },
        border: {
          1: '#2a2a2a',
          2: '#363636',
        },
        txt: {
          1: '#f0ede8',
          2: '#9a9690',
          3: '#5a5753',
        },
        accent: {
          DEFAULT: '#d4a853',
          dim: '#2e2010',
        },
        health: {
          DEFAULT: '#4ade80',
          dim: '#1a3a25',
        },
        rel: {
          DEFAULT: '#f472b6',
          dim: '#3a1a2e',
        },
        career: {
          DEFAULT: '#60a5fa',
          dim: '#1a2a3a',
        },
        money: {
          DEFAULT: '#fbbf24',
          dim: '#3a2e0a',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease',
        'fade-in': 'fadeIn 0.4s ease',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(120%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
