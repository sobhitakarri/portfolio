/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':        '#0a0a0f',
        'void-2':      '#0f0f1a',
        'void-3':      '#13131f',
        'circuit':     '#00ff88',
        'circuit-dim': '#00cc6a',
        'circuit-glow':'#00ff8833',
        'purple-chip': '#7c3aed',
        'purple-dim':  '#5b21b6',
        'text-muted':  '#8892a4',
        'text-bright': '#c9d1d9',
        'border-dim':  '#1e2030',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'cursor-blink':   'blink 1s step-end infinite',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'scanline':       'scanline 8s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'glitch':         'glitch 4s infinite',
        'trace-draw':     'traceDraw 1.5s ease-out forwards',
        'fade-up':        'fadeUp 0.6s ease-out forwards',
        'spin-slow':      'spin 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff8844, 0 0 20px #00ff8822' },
          '50%':      { boxShadow: '0 0 15px #00ff8888, 0 0 40px #00ff8844' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', filter: 'none' },
          '91%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(90deg)' },
          '92%': { transform: 'translate(2px, -1px)', filter: 'hue-rotate(-90deg)' },
          '93%': { transform: 'translate(0)', filter: 'none' },
          '94%': { transform: 'translate(3px, 0px)', filter: 'saturate(3)' },
          '95%': { transform: 'translate(0)', filter: 'none' },
        },
        traceDraw: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
