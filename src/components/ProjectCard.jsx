import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi'

const CATEGORY_COLORS = {
  RTL:          '#00ff88',
  Verification: '#7c3aed',
  FPGA:         '#3b82f6',
  ASIC:         '#f59e0b',
}

/* Waveform SVG — decorative */
function WaveformSVG({ color }) {
  const points = [0,1,1,0,0,1,0.5,0,0,1,1,0,0.3,1,0,0,1,1,0,0.7,0,1]
  const h = 40
  const w = 300
  const step = w / (points.length - 1)
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * step},${p === 0 ? 5 : h - 5}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
      {points.map((p, i) => (
        i > 0 && points[i] !== points[i-1] && (
          <line
            key={i}
            x1={i * step} y1={5}
            x2={i * step} y2={h - 5}
            stroke={color} strokeWidth="1.5" opacity="0.7"
          />
        )
      ))}
    </svg>
  )
}

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[project.category] || '#00ff88'

  return (
    <>
      <motion.div
        className="ic-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ y: -4 }}
        onClick={() => setExpanded(true)}
        style={{
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Color bar top */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />

        {/* Card body */}
        <div style={{ padding: '20px 20px 16px', flex: 1 }}>
          {/* Category + date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.65rem',
              color: color,
              border: `1px solid ${color}44`,
              padding: '2px 8px',
              borderRadius: 2,
              background: `${color}11`,
              letterSpacing: '0.1em',
            }}>
              {project.category}
            </span>
            <span style={{ color: '#8892a4', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '1rem',
            color: '#c9d1d9',
            marginBottom: 8,
            lineHeight: 1.4,
          }}>
            {project.title}
          </h3>

          {/* Tagline */}
          <p style={{ color: '#8892a4', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16 }}>
            {project.tagline}
          </p>

          {/* Waveform decoration */}
          <div style={{ marginBottom: 16, opacity: 0.5 }}>
            <WaveformSVG color={color} />
          </div>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.map(tag => (
              <span key={tag} className="tag-chip" style={{ fontSize: '0.65rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Click hint */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid #1e2030',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#8892a4',
          fontSize: '0.72rem',
          fontFamily: 'JetBrains Mono',
        }}>
          <span>Click to expand</span>
          <FiExternalLink size={14} />
        </div>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 500,
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="modal-scroll"
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: 640,
                maxHeight: '85vh',
                overflowY: 'auto',
                background: '#0f0f1a',
                border: `1px solid ${color}44`,
                borderRadius: 4,
                zIndex: 501,
                boxShadow: `0 0 40px ${color}22`,
              }}
            >
              {/* Modal top bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}44, transparent)` }} />

              <div style={{ padding: '24px 28px' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                      color: color, letterSpacing: '0.1em',
                    }}>
                      {project.category} / {project.date}
                    </span>
                    <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', color: '#c9d1d9', marginTop: 6 }}>
                      {project.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    style={{
                      background: 'none', border: '1px solid #1e2030',
                      borderRadius: 2, padding: '6px',
                      color: '#8892a4', cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Waveform */}
                <div style={{
                  background: '#13131f',
                  border: '1px solid #1e2030',
                  borderRadius: 4,
                  padding: '16px 20px',
                  marginBottom: 20,
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8892a4', marginBottom: 10, letterSpacing: '0.1em' }}>
                    // SIGNAL WAVEFORM
                  </div>
                  <WaveformSVG color={color} />
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    {['CLK', 'DATA', 'VALID', 'READY'].map((sig, i) => (
                      <span key={sig} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#8892a4' }}>
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Design spec */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8892a4', marginBottom: 10, letterSpacing: '0.1em' }}>
                    // DESIGN SPEC
                  </div>
                  <p style={{ color: '#8892a4', fontSize: '0.875rem', lineHeight: 1.8 }}>
                    {project.spec}
                  </p>
                </div>

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {project.tags.map(tag => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>

                {/* GitHub link */}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-circuit"
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
