import { useState } from 'react'
import { useScrollFade } from '../hooks/useScrollFade'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

const FILTERS = ['All', 'FPGA']

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const titleRef = useScrollFade()

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" style={{ background: 'rgba(15,15,26,0.4)', position: 'relative', zIndex: 2 }}>
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 03. PROJECTS
          </p>
          <h2 className="section-title">What I've <span className="accent">Built</span></h2>
          <p className="section-subtitle">RTL designs, verification environments, and hardware systems.</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px',
                border: `1px solid ${filter === f ? '#00ff88' : '#1e2030'}`,
                background: filter === f ? 'rgba(0,255,136,0.08)' : 'transparent',
                color: filter === f ? '#00ff88' : '#8892a4',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.75rem',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
