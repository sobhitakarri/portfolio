import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink, FiCpu } from 'react-icons/fi'

const CATEGORY_META = {
  RTL:          { color: 'var(--accent)',  bg: 'rgba(0,229,160,0.1)',    border: 'rgba(0,229,160,0.25)' },
  Verification: { color: 'var(--violet)', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)' },
  FPGA:         { color: 'var(--blue)',   bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.25)' },
  ASIC:         { color: 'var(--amber)',  bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)' },
}

/* Waveform decoration SVG */
function WaveformBar({ color, index }) {
  const heights = [30, 80, 50, 100, 20, 70, 40, 90, 60, 35, 75, 25, 85, 45, 100, 30, 65, 50]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.08 + i * 0.02, duration: 0.3, ease: 'backOut' }}
          style={{
            width: 3,
            height: `${h}%`,
            background: color,
            opacity: 0.3 + (h / 100) * 0.5,
            borderRadius: 1,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[project.category] || CATEGORY_META.RTL

  return (
    <>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22,1,0.36,1] }}
        whileHover={{ y: -5, transition: { duration: 0.22 } }}
        onClick={() => setExpanded(true)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Gradient top bar */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${meta.color}, transparent)`,
        }} />

        <div style={{ padding: '22px 22px 18px', flex: 1 }}>
          {/* Category + date row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.68rem',
              color: meta.color,
              border: `1px solid ${meta.border}`,
              padding: '3px 10px',
              borderRadius: 100,
              background: meta.bg,
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              <FiCpu size={10} />
              {project.category}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.08rem',
            fontWeight: 600,
            color: 'var(--text-bright)',
            marginBottom: 10,
            lineHeight: 1.35,
          }}>
            {project.title}
          </h3>

          {/* Tagline */}
          <p style={{
            color: 'var(--text-body)',
            fontSize: '0.84rem',
            lineHeight: 1.65,
            marginBottom: 18,
          }}>
            {project.tagline}
          </p>

          {/* Waveform */}
          <div style={{ marginBottom: 18 }}>
            <WaveformBar color={meta.color} index={index} />
          </div>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} className="tag-chip" style={{ fontSize: '0.67rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--text-muted)',
          fontSize: '0.76rem',
          fontFamily: 'Inter, sans-serif',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>
            View details →
          </span>
          <FiExternalLink size={14} />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpanded(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(12px)',
                zIndex: 500,
              }}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="modal-scroll"
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: 660,
                maxHeight: '88vh',
                overflowY: 'auto',
                background: 'var(--bg-elevated)',
                border: `1px solid ${meta.border}`,
                borderRadius: 14,
                zIndex: 501,
                boxShadow: `0 0 60px ${meta.color}22, 0 24px 80px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Modal top bar */}
              <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${meta.color}, ${meta.color}44, transparent)`,
                borderRadius: '14px 14px 0 0',
              }} />

              <div style={{ padding: '28px 32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
                      color: meta.color, letterSpacing: '0.1em', fontWeight: 600,
                      border: `1px solid ${meta.border}`,
                      padding: '3px 10px', borderRadius: 100, background: meta.bg,
                    }}>
                      <FiCpu size={10} />
                      {project.category}
                    </span>
                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-bright)',
                      marginTop: 10,
                      lineHeight: 1.25,
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontFamily: 'JetBrains Mono',
                      marginTop: 4,
                    }}>
                      {project.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      display: 'flex', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--text-bright)'
                      e.currentTarget.style.borderColor = 'var(--border-mid)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Signal waveform box */}
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  marginBottom: 22,
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                      color: 'var(--text-muted)', letterSpacing: '0.12em',
                    }}>
                      // SIGNAL PROFILE
                    </span>
                    <div style={{ display: 'flex', gap: 14 }}>
                      {['CLK', 'DATA', 'VALID', 'READY'].map(sig => (
                        <span key={sig} style={{
                          fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
                          color: 'var(--text-faint)',
                        }}>
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                  <WaveformBar color={meta.color} index={index} />
                </div>

                {/* Design spec */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                    color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.12em',
                  }}>
                    // DESIGN SPECIFICATION
                  </div>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.85 }}>
                    {project.spec}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  {project.tags.map(tag => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>

                {/* GitHub CTA */}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ gap: 8 }}
                >
                  <FiGithub size={15} />
                  View on GitHub
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
