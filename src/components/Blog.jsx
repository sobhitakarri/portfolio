import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'
import { blogPosts } from '../data/blog'

export default function Blog() {
  const [expanded, setExpanded] = useState(null)
  const titleRef = useScrollFade()

  return (
    <section id="blog" style={{ background: 'rgba(15,15,26,0.4)', position: 'relative', zIndex: 2 }}>
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 05. NOTES
          </p>
          <h2 className="section-title">Design <span className="accent">Notes</span></h2>
          <p className="section-subtitle">Write-ups on what I build and learn.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              className="ic-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Post header — always visible */}
              <div
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                }}
                onClick={() => setExpanded(expanded === post.id ? null : post.id)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span key={tag} className="tag-chip" style={{ fontSize: '0.65rem' }}>{tag}</span>
                    ))}
                    <span style={{ color: '#8892a4', fontFamily: 'JetBrains Mono', fontSize: '0.7rem' }}>
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'JetBrains Mono', fontSize: '0.95rem', color: '#c9d1d9', marginBottom: 6, lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: '#8892a4', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {post.excerpt}
                  </p>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                  transform: expanded === post.id ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}>
                  +
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {expanded === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 24px 24px',
                      borderTop: '1px solid #1e2030',
                      paddingTop: 20,
                    }}>
                      {post.content.split('\n\n').map((para, pi) => (
                        <p key={pi} style={{ color: '#8892a4', fontSize: '0.875rem', lineHeight: 1.9, marginBottom: 16 }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
