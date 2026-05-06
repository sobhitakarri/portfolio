import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollFade } from '../hooks/useScrollFade'
import { blogPosts } from '../data/blog'
import { FiChevronDown, FiClock, FiTag } from 'react-icons/fi'

export default function Blog() {
  const [expanded, setExpanded] = useState(null)
  const titleRef = useScrollFade()

  return (
    <section id="blog" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p className="section-eyebrow">05. Notes</p>
          <h2 className="section-title">Design <span className="accent">Notes</span></h2>
          <p className="section-subtitle">Write-ups on what I build and learn.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {blogPosts.map((post, i) => {
            const isOpen = expanded === post.id
            return (
              <motion.div
                key={post.id}
                className="card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5, ease: [0.22,1,0.36,1] }}
                style={{ overflow: 'hidden' }}
              >
                {/* Post header */}
                <div
                  style={{
                    padding: '22px 26px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 20,
                    transition: 'background 0.2s',
                    background: isOpen ? 'rgba(0,229,160,0.03)' : 'transparent',
                  }}
                  onClick={() => setExpanded(isOpen ? null : post.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Meta row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      marginBottom: 10, flexWrap: 'wrap',
                    }}>
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: '0.65rem',
                            fontFamily: 'JetBrains Mono, monospace',
                            color: 'var(--accent)',
                            border: '1px solid rgba(0,229,160,0.2)',
                            background: 'rgba(0,229,160,0.06)',
                            padding: '2px 8px',
                            borderRadius: 4,
                          }}
                        >
                          <FiTag size={9} />
                          {tag}
                        </span>
                      ))}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: 'var(--text-muted)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                      }}>
                        <FiClock size={11} />
                        {post.date} · {post.readTime}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: isOpen ? 'var(--accent)' : 'var(--text-bright)',
                      marginBottom: 6,
                      lineHeight: 1.4,
                      transition: 'color 0.2s',
                    }}>
                      {post.title}
                    </h3>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.65 }}>
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Expand toggle */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      color: isOpen ? 'var(--accent)' : 'var(--text-muted)',
                      flexShrink: 0,
                      marginTop: 2,
                      transition: 'color 0.2s',
                    }}
                  >
                    <FiChevronDown size={18} />
                  </motion.div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 26px 26px',
                        borderTop: '1px solid var(--border)',
                        paddingTop: 22,
                      }}>
                        {/* Left accent bar */}
                        <div style={{
                          borderLeft: '2px solid rgba(0,229,160,0.4)',
                          paddingLeft: 18,
                        }}>
                          {post.content.split('\n\n').map((para, pi) => (
                            <p key={pi} style={{
                              color: 'var(--text-body)',
                              fontSize: '0.9rem',
                              lineHeight: 1.9,
                              marginBottom: 14,
                            }}>
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
