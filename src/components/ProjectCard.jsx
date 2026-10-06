import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiChevronDown, FiCalendar } from 'react-icons/fi'

const ease = [0.22, 1, 0.36, 1]

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        marginTop: -1,
        background: expanded ? 'rgba(255,255,255,0.5)' : 'transparent',
        transition: 'background 0.25s ease',
      }}
    >
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.06em',
            color: 'var(--text-faint)',
          }}>
            <FiCalendar size={11} />
            {project.date}
          </div>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.62rem',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ width: 5, height: 5, background: 'var(--accent)' }} />
            {project.category}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--text-bright)',
          marginBottom: 8,
          lineHeight: 1.25,
          letterSpacing: '-0.025em',
        }}>
          {project.title}
        </h3>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          marginBottom: 16,
        }}>
          {project.tagline}
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 5,
          marginBottom: 8,
        }}>
          {project.tags.map(tag => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>
      </div>

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px 24px',
          marginTop: 12,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: expanded ? 'var(--accent)' : 'var(--text-faint)',
            transition: 'color 0.2s',
          }}>
            {expanded ? 'Hide details' : 'View details'}
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                color: 'var(--text-faint)',
                display: 'flex',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              <FiGithub size={14} />
            </a>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: expanded ? 'var(--accent)' : 'var(--text-faint)' }}
        >
          <FiChevronDown size={15} />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{
                borderLeft: '2px solid var(--accent)',
                paddingLeft: 16,
              }}>
                <p style={{
                  color: 'var(--text-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                }}>
                  {project.spec}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
