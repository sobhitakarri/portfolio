/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':        '#060610',
        'base':        '#0b0b18',
        'elevated':    '#10101f',
        'surface':     '#161628',
        'hover':       '#1c1c32',
        'accent':      '#00e5a0',
        'accent-dim':  '#00b87d',
        'violet':      '#8b5cf6',
        'blue':        '#38bdf8',
        'amber':       '#f59e0b',
        'text-bright': '#eef0f6',
        'text-body':   '#a8b2c4',
        'text-muted':  '#5a6478',
        'text-faint':  '#3a4055',
        'border':      '#1e2038',
        'border-mid':  '#2a2d4a',
      },
      fontFamily: {
        mono:    ['JetBrains Mono', 'monospace'],
        sans:    ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'blink':       'blink 1s step-end infinite',
        'pulse-dot':   'pulse-dot 2s infinite',
        'glow-breathe':'glow-breathe 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'fade-up':     'fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,229,160,0.4)' },
          '50%':      { boxShadow: '0 0 0 5px rgba(0,229,160,0)' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
