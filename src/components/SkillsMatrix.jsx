import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'
import { skillCategories } from '../data/skills'

const BADGE_STYLES = {
  ADVANCED:     { bg: 'rgba(0,229,160,0.1)',    border: 'rgba(0,229,160,0.3)',    text: 'var(--accent)',  dot: 'var(--accent)' },
  INTERMEDIATE: { bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)',   text: 'var(--violet)', dot: 'var(--violet)' },
  JUNIOR:       { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.25)',  text: 'var(--blue)',   dot: 'var(--blue)' },
}

function SkillBar({ name, level, badge, index }) {
  const b = BADGE_STYLES[badge] || BADGE_STYLES.JUNIOR

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22,1,0.36,1] }}
      className="card"
      style={{ padding: '16px 18px' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-bright)',
        }}>
          {name}
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 10px',
          borderRadius: 100,
          fontSize: '0.65rem',
          fontFamily: 'JetBrains Mono, monospace',
          border: `1px solid ${b.border}`,
          background: b.bg,
          color: b.text,
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: b.dot, display: 'inline-block' }} />
          {badge}
        </div>
      </div>

      <div className="skill-bar-bg">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.9, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
        />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 6,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
      }}>
        <span>Proficiency</span>
        <span style={{ color: b.text }}>{level}%</span>
      </div>
    </motion.div>
  )
}

export default function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState(skillCategories[0]?.id || 'hdl')
  const titleRef = useScrollFade()
  const activeCategory = skillCategories.find(c => c.id === activeTab)

  return (
    <section id="skills" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p className="section-eyebrow">02. Skills</p>
          <h2 className="section-title">Skills <span className="accent">Matrix</span></h2>
          <p className="section-subtitle">Technical proficiency across the RTL-to-GDS stack.</p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 6,
          marginBottom: 36,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 5,
          flexWrap: 'wrap',
        }}>
          {skillCategories.map(cat => {
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  flex: 1,
                  minWidth: 130,
                  padding: '9px 16px',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--accent), var(--blue))'
                    : 'transparent',
                  border: 'none',
                  borderRadius: 7,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#060610' : 'var(--text-muted)',
                  transition: 'all 0.22s ease',
                  letterSpacing: '0.01em',
                  boxShadow: isActive ? '0 2px 12px rgba(0,229,160,0.25)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-bright)'
                    e.currentTarget.style.background = 'var(--bg-hover)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {activeCategory?.skills.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
