import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowDown, FiEye, FiNavigation, FiSettings, FiCpu, FiBox } from 'react-icons/fi'

const ease = [0.16, 1, 0.3, 1]

const ICONS = [
  { icon: FiEye,        label: 'Perception' },
  { icon: FiNavigation, label: 'Navigation' },
  { icon: FiSettings,   label: 'Control' },
  { icon: FiCpu,        label: 'Embedded' },
  { icon: FiBox,        label: 'Simulation' },
]

export default function Hero({ enter = true }) {
  const [laser, setLaser] = useState(false)
  const [sliced, setSliced] = useState(false)

  useEffect(() => {
    if (!enter) {
      setLaser(false)
      setSliced(false)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSliced(true)
      return
    }
    const t1 = window.setTimeout(() => setLaser(true), 120)
    const t2 = window.setTimeout(() => setSliced(true), 120 + 920)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [enter])

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
            animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: enter ? 0.05 : 0, duration: 0.55, ease }}
            style={{ display: 'flex', marginBottom: 20 }}
          >
            01 Intro · Open to work
          </motion.p>

          <div className="hero-name-wrap">
            <h1
              id="hero-name"
              className={`type-display${sliced ? ' display-slice' : ''}`}
              style={{
                opacity: enter ? 1 : 0,
                transition: 'none',
                pointerEvents: enter ? 'auto' : 'none',
              }}
              aria-hidden={!enter}
            >
              Sobhita Karri
            </h1>
            {laser && (
              <>
                <span className="name-laser-glow" aria-hidden />
                <span className="name-laser" aria-hidden />
                <span className="name-laser-spark" aria-hidden />
              </>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ delay: enter ? 0.35 : 0, duration: 0.55, ease }}
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
            animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: enter ? 0.45 : 0, duration: 0.55, ease }}
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
            animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: enter ? 0.55 : 0, duration: 0.5, ease }}
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
            animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: enter ? 0.65 : 0, duration: 0.55, ease }}
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
