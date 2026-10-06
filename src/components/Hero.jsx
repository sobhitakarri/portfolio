import { motion } from 'framer-motion'
import { FiArrowDown, FiEye, FiNavigation, FiSettings, FiCpu, FiBox } from 'react-icons/fi'
const ease = [0.22, 1, 0.36, 1]

const ICONS = [
  { icon: FiEye,        label: 'Perception' },
  { icon: FiNavigation, label: 'Navigation' },
  { icon: FiSettings,   label: 'Control' },
  { icon: FiCpu,        label: 'Embedded' },
  { icon: FiBox,        label: 'Simulation' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'var(--nav-h)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className="section-wrapper"
        style={{
          paddingTop: 'clamp(32px, 6vh, 72px)',
          paddingBottom: 'clamp(48px, 8vh, 96px)',
          zIndex: 5,
          width: '100%',
          position: 'relative',
        }}
      >
        <div className="hero-content">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
            style={{ marginBottom: 20 }}
          >
            01 Intro · Open to work
          </motion.p>

          <motion.h1
            className="type-display display-slice"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.7, ease }}
            style={{ marginBottom: 18, maxWidth: '12ch' }}
          >
            Sobhita Karri
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.55, ease }}
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(0.78rem, 1.5vw, 0.92rem)',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-bright)',
              marginBottom: 16,
              lineHeight: 1.45,
            }}
          >
            Robotics{' '}
            <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>|</span>{' '}
            Autonomous Systems{' '}
            <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>|</span>{' '}
            Embedded
          </motion.p>

          <motion.p
            className="type-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.55, ease }}
            style={{
              color: 'var(--text-muted)',
              maxWidth: '48ch',
              marginBottom: 28,
              fontSize: 'var(--fs-lead)',
              lineHeight: 1.55,
            }}
          >
            ECE undergraduate building systems where perception, planning,
            control, and hardware meet — drones, embedded motion, and real-time intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.5, ease }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              View Work
            </button>
            <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Resume
            </a>
          </motion.div>

          <motion.div
            className="hero-icons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.55, ease }}
          >
            {ICONS.map(({ icon: Icon, label }) => (
              <div key={label} className="hero-icon-item">
                <Icon size={18} strokeWidth={1.5} />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        aria-label="Scroll to about"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 'var(--section-px)',
          background: 'var(--bg-void)',
          border: '1px solid var(--border-mid)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          zIndex: 4,
        }}
      >
        <FiArrowDown size={16} />
      </motion.button>
    </section>
  )
}
