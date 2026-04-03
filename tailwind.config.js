/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          deep:   '#0A0C10',
          base:   '#12151C',
          raised: '#181C25',
          border: '#1E2330',
        },
        ink: {
          bright: '#F0F2F5',
          body:   '#C8CCD4',
          dim:    '#5A6070',
          ghost:  '#3A3F4C',
        },
        gold:    '#E8C547',
        ok:      '#47E8A0',
        no:      '#E84747',
        warn:    '#E8A347',
        sky:     '#47A0E8',
        violet:  '#A047E8',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        fadeSlideIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        goldGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,197,71,0)' },
          '50%':      { boxShadow: '0 0 12px 2px rgba(232,197,71,0.25)' },
        },
      },
      animation: {
        fadeSlideIn: 'fadeSlideIn 0.25s ease-out',
        blink:       'blink 1.4s ease-in-out infinite',
        goldGlow:    'goldGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}