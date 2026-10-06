/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':        'var(--bg-void)',
        'base':        'var(--bg-base)',
        'elevated':    'var(--bg-elevated)',
        'surface':     'var(--bg-surface)',
        'hover':       'var(--bg-hover)',
        'accent':      'var(--accent)',
        'accent-dim':  'var(--accent-dim)',
        'violet':      'var(--violet)',
        'warm':        'var(--warm)',
        'text-bright': 'var(--text-bright)',
        'text-body':   'var(--text-body)',
        'text-muted':  'var(--text-muted)',
        'text-faint':  'var(--text-faint)',
      },
      fontFamily: {
        mono:    ['IBM Plex Mono', 'monospace'],
        sans:    ['Inter Tight', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Inter Tight', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-dot':   'pulse-dot 2.5s infinite',
        'float':       'float 6s ease-in-out infinite',
        'fade-up':     'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.35' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
