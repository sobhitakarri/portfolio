import { motion } from 'framer-motion'
import { FiGithub, FiCalendar, FiImage, FiArrowUpRight } from 'react-icons/fi'

const ease = [0.16, 1, 0.3, 1]

function resolveAssetUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const clean = url.startsWith('/') ? url.slice(1) : url
  return `${import.meta.env.BASE_URL}${clean}`
}

export default function ProjectCard({ project, index, onOpenDetails }) {
  const hasImages = Array.isArray(project.images) && project.images.length > 0
  // Show at most 4 tags on the card to stay compact
  const visibleTags = project.tags.slice(0, 4)
  const extraTags = project.tags.length - visibleTags.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ delay: Math.min(index * 0.08, 0.32), duration: 0.85, ease }}
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-mid)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image (only for projects that have one) */}
      {hasImages && project.coverImage && (
        <div
          onClick={() => onOpenDetails(project)}
          style={{
            position: 'relative',
            height: 180,
            overflow: 'hidden',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            background: '#0a0a0d',
          }}
        >
          <img
            src={resolveAssetUrl(project.coverImage)}
            alt={`${project.title} preview`}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: 0.88, transition: 'transform 0.4s ease, opacity 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.88' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,13,0.75) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 10, right: 10,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
            color: '#fff', background: 'var(--accent)', padding: '2px 7px',
            display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600,
          }}>
            <FiImage size={10} /> {project.images.length}
          </div>
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '20px 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Date + category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.63rem',
            letterSpacing: '0.06em', color: 'var(--text-faint)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <FiCalendar size={10} /> {project.date}
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
            color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, background: 'var(--accent)' }} />
            {project.category}
          </span>
        </div>

        {/* Title — clickable */}
        <h3
          onClick={() => onOpenDetails(project)}
          style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: '1.15rem', fontWeight: 700,
            color: 'var(--text-bright)', lineHeight: 1.25, letterSpacing: '-0.022em',
            marginBottom: 7, cursor: 'pointer', transition: 'color 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-bright)')}
        >
          {project.title}
        </h3>

        {/* Tagline only — no metrics grid */}
        <p style={{
          color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.6,
          marginBottom: 14,
        }}>
          {project.tagline}
        </p>

        {/* Compact tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16, marginTop: 'auto' }}>
          {visibleTags.map(tag => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
          {extraTags > 0 && (
            <span className="tag-chip" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>
              +{extraTags}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '11px 20px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          type="button"
          onClick={() => onOpenDetails(project)}
          style={{
            background: 'transparent', border: 'none', padding: 0,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: 'Inter Tight, sans-serif', fontSize: '0.72rem',
            fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-bright)', cursor: 'pointer', transition: 'color 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-bright)')}
        >
          More Details <FiArrowUpRight size={13} style={{ color: 'var(--accent)' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hasImages && (
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
              color: 'var(--text-faint)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <FiImage size={11} /> {project.images.length} photos
            </span>
          )}
          {project.github && (
            <a
              href={project.github} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-faint)', display: 'flex', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
            >
              <FiGithub size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
