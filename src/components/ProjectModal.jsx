import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi'

function resolveAssetUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const clean = url.startsWith('/') ? url.slice(1) : url
  return `${import.meta.env.BASE_URL}${clean}`
}

export default function ProjectModal({ project, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    setActiveImageIndex(0)
    setZoom(false)
  }, [project])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { if (zoom) setZoom(false); else onClose() }
    if (!project?.images?.length) return
    if (e.key === 'ArrowLeft') setActiveImageIndex(p => (p - 1 + project.images.length) % project.images.length)
    if (e.key === 'ArrowRight') setActiveImageIndex(p => (p + 1) % project.images.length)
  }, [onClose, zoom, project])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = '' }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !project) return null

  const hasImages = Array.isArray(project.images) && project.images.length > 0
  const activeImage = hasImages ? project.images[activeImageIndex] : null
  const activeUrl = activeImage ? resolveAssetUrl(activeImage.url) : null

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        /* Push modal below the fixed navbar (64px) + small gap */
        paddingTop: 'calc(var(--nav-h) + 16px)',
        paddingBottom: 16,
        paddingLeft: 'clamp(12px, 2vw, 24px)',
        paddingRight: 'clamp(12px, 2vw, 24px)',
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,14,0.72)', backdropFilter: 'blur(10px)' }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 960,
            maxHeight: 'calc(92vh - var(--nav-h))',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-mid)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Window Title Bar */}
          <div style={{
            padding: '10px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, background: 'var(--accent)' }} />
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                fontWeight: 600,
              }}>{project.category}</span>
              <span style={{ color: 'var(--border-mid)', fontSize: '0.8rem' }}>|</span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-faint)',
              }}>{project.date}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onClose} aria-label="Close" style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: hasImages ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr',
              gap: 0,
              minHeight: '100%',
            }}>

              {/* ── LEFT: Image gallery */}
              {hasImages && (
                <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  {/* Main image */}
                  <div
                    onClick={() => setZoom(true)}
                    style={{
                      position: 'relative', flexShrink: 0,
                      height: 280, background: '#09090c',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'zoom-in', overflow: 'hidden',
                    }}
                  >
                    <img
                      src={activeUrl}
                      alt={activeImage?.caption || project.title}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                    />

                    {/* Tag pill */}
                    {activeImage?.tag && (
                      <div style={{
                        position: 'absolute', top: 10, left: 10,
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.75)', border: '1px solid var(--accent)',
                        color: 'var(--accent)', padding: '2px 7px',
                      }}>{activeImage.tag}</div>
                    )}

                    {/* Fullscreen hint */}
                    <div style={{
                      position: 'absolute', bottom: 8, right: 8,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                      color: '#fff', background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.15)', padding: '2px 6px',
                    }}>
                      <FiMaximize2 size={9} /> Full size
                    </div>

                    {/* Arrow nav */}
                    {project.images.length > 1 && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setActiveImageIndex(p => (p - 1 + project.images.length) % project.images.length) }} style={arrowBtn('left')}>
                          <FiChevronLeft size={16} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setActiveImageIndex(p => (p + 1) % project.images.length) }} style={arrowBtn('right')}>
                          <FiChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Caption */}
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {activeImage?.caption}
                    </p>
                  </div>

                  {/* Thumbnails */}
                  {project.images.length > 1 && (
                    <div style={{
                      display: 'flex', gap: 6, padding: '10px 14px',
                      overflowX: 'auto', scrollbarWidth: 'thin', flexShrink: 0,
                    }}>
                      {project.images.map((img, idx) => {
                        const active = idx === activeImageIndex
                        return (
                          <button key={idx} onClick={() => setActiveImageIndex(idx)} style={{
                            flexShrink: 0, width: 64, height: 44, padding: 0,
                            border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                            background: '#111', overflow: 'hidden', cursor: 'pointer',
                            opacity: active ? 1 : 0.55, transition: 'opacity 0.2s, border-color 0.2s',
                          }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '0.85' }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.55' }}
                          >
                            <img src={resolveAssetUrl(img.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Tools & Stack — under thumbnails, freeing up right column */}
                  <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
                    <div style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--text-faint)', marginBottom: 8,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ width: 4, height: 4, background: 'var(--accent)' }} />
                      Tools & Stack
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {project.tags.map(tag => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── RIGHT: Info */}
              <div style={{ padding: '28px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Title + tagline */}
                <div>
                  <h3 style={{
                    fontFamily: 'Inter Tight, sans-serif', fontSize: '1.5rem',
                    fontWeight: 700, color: 'var(--text-bright)',
                    letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 10,
                  }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                    {project.tagline}
                  </p>
                </div>

                {/* What / Why / How — 3 tight punchy bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.highlights?.slice(0, 3).map((h, i) => {
                    const labels = ['WHAT', 'WHY', 'HOW']
                    return (
                      <div key={h.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                          fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)',
                          border: '1px solid var(--accent)', padding: '2px 5px',
                          flexShrink: 0, marginTop: 2,
                        }}>{labels[i] || `0${i + 1}`}</span>
                        <div>
                          <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                            {h.title}
                          </span>
                          <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {!hasImages && Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div style={{ paddingTop: 6 }}>
                    <div style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--text-faint)', marginBottom: 8,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ width: 4, height: 4, background: 'var(--accent)' }} />
                      Tools & Stack
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {project.tags.map(tag => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {project.github && (
                  <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontSize: '0.8rem', padding: '10px 20px',
                        background: 'var(--accent-faint)', borderColor: 'var(--accent)',
                        color: 'var(--accent)', fontWeight: 600, textDecoration: 'none',
                      }}
                    >
                      <FiGithub size={15} /> View on GitHub <FiExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen zoom overlay */}
      {zoom && activeUrl && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10001,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => setZoom(false)}
        >
          <button onClick={() => setZoom(false)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', width: 38, height: 38, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <FiX size={18} />
          </button>
          <img
            src={activeUrl}
            alt={activeImage?.caption}
            style={{ maxWidth: '92vw', maxHeight: '84vh', objectFit: 'contain' }}
          />
          {activeImage?.caption && (
            <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', textAlign: 'center', maxWidth: 700 }}>
              {activeImage.caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function arrowBtn(side) {
  return {
    position: 'absolute', [side]: 8, top: '50%', transform: 'translateY(-50%)',
    width: 30, height: 30, background: 'rgba(0,0,0,0.65)',
    border: '1px solid rgba(255,255,255,0.18)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'background 0.18s',
  }
}
