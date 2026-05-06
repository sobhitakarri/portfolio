import { useState } from 'react'
import { useScrollFade } from '../hooks/useScrollFade'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

const FILTERS = ['All', 'FPGA', 'RTL', 'Verification', 'ASIC']

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const titleRef = useScrollFade()

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p className="section-eyebrow">03. Projects</p>
          <h2 className="section-title">What I've <span className="accent">Built</span></h2>
          <p className="section-subtitle">RTL designs, verification environments, and hardware systems.</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 18px',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  background: isActive ? 'var(--accent-faint)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 600 : 400,
                  borderRadius: 100,
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-mid)'
                    e.currentTarget.style.color = 'var(--text-body)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 22,
        }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.85rem',
          }}>
            // no projects in this category yet
          </div>
        )}
      </div>
    </section>
  )
}
