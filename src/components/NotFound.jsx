import { motion } from 'framer-motion'
import { FiArrowLeft, FiGithub } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const GLITCH_LINES = [
  '> kernel panic: route not found',
  '> signal lost at address 0x404',
  '> attempting recovery...',
  '> fatal: no valid path to destination',
]

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* PCB grid background */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial fade over grid */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, var(--bg-void) 100%)',
        }}
      />

      {/* Dead chip SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 36, position: 'relative', zIndex: 1 }}
      >
        <img
          src="/404-chip.svg"
          alt="Dead chip — 404"
          style={{ width: 'min(520px, 90vw)', height: 'auto', display: 'block' }}
        />
      </motion.div>

      {/* Terminal error log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.55 }}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '18px 24px',
          width: 'min(520px, 90vw)',
          marginBottom: 36,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Titlebar dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          {['#ff5f56', '#ffbd2e', 'var(--accent)'].map((c, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', background: c,
              boxShadow: i === 2 ? '0 0 6px rgba(0,229,160,0.4)' : 'none',
            }} />
          ))}
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginLeft: 8,
          }}>
            ./router --debug
          </span>
        </div>

        {/* Log lines */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', lineHeight: 2 }}>
          {GLITCH_LINES.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              style={{
                color: i === GLITCH_LINES.length - 1 ? '#ff5f56' : 'var(--text-muted)',
              }}
            >
              {line}
            </motion.div>
          ))}

          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: 'var(--accent)', display: 'inline-block', marginTop: 4 }}
          >
            █
          </motion.span>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}
      >
        <Link
          to="/"
          className="btn-primary"
          style={{ gap: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          <FiArrowLeft size={15} />
          Back to Portfolio
        </Link>

        <a
          href="https://github.com/sobhitakarri"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
          style={{ gap: 8, display: 'inline-flex', alignItems: 'center' }}
        >
          <FiGithub size={15} />
          GitHub
        </a>
      </motion.div>

      {/* Error code watermark */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 40,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.7rem',
        color: 'var(--text-faint)',
        opacity: 0.4,
        userSelect: 'none',
        zIndex: 1,
      }}>
        ERR_ROUTE_NOT_RESOLVED · 0x00000404
      </div>
    </div>
  )
}
