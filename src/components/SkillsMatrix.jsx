import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'
import { skillCategories } from '../data/skills'

const BADGE_COLORS = {
  ADVANCED:     { bg: 'rgba(0,255,136,0.12)', border: '#00ff8844', text: '#00ff88' },
  INTERMEDIATE: { bg: 'rgba(124,58,237,0.12)', border: '#7c3aed44', text: '#7c3aed' },
  JUNIOR:       { bg: 'rgba(136,146,164,0.12)', border: '#8892a444', text: '#8892a4' },
}

function SkillBar({ name, level, badge, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: '#13131f',
        border: '1px solid #1e2030',
        borderRadius: 4,
        padding: '14px 16px',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: '#00ff8833', y: -2 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#c9d1d9' }}>
          {name}
        </span>
        <div style={{
          padding: '2px 8px',
          borderRadius: 2,
          fontSize: '0.65rem',
          fontFamily: 'JetBrains Mono',
          border: `1px solid ${BADGE_COLORS[badge].border}`,
          background: BADGE_COLORS[badge].bg,
          color: BADGE_COLORS[badge].text,
          letterSpacing: '0.05em',
        }}>
          {badge}
        </div>
      </div>
      <div className="skill-bar-bg">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
        />
      </div>
      <div style={{ textAlign: 'right', marginTop: 4, fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8892a4' }}>
        {level}%
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
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 02. SKILLS
          </p>
          <h2 className="section-title">Skills <span className="accent">Matrix</span></h2>
          <p className="section-subtitle">Technical proficiency across the RTL-to-GDS stack.</p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 32,
          background: '#0f0f1a',
          border: '1px solid #1e2030',
          borderRadius: 4,
          padding: 4,
          flexWrap: 'wrap',
        }}>
          {skillCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '10px 16px',
                background: activeTab === cat.id ? '#00ff88' : 'transparent',
                border: 'none',
                borderRadius: 2,
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.78rem',
                color: activeTab === cat.id ? '#0a0a0f' : '#8892a4',
                fontWeight: activeTab === cat.id ? 600 : 400,
                transition: 'all 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
            }}
          >
            {activeCategory.skills.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
