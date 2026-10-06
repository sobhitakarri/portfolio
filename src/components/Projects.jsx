import { useState } from 'react'
import { useScrollFade } from '../hooks/useScrollFade'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

const FILTERS = ['All', 'Autonomy', 'Embedded', 'Hardware']

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
          <p className="section-label">04 Projects</p>
          <h2 className="section-heading">What I&apos;ve built</h2>
          <p className="section-desc">From autonomous flight systems to hardware accelerators.</p>
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 40, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '12px 18px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--text-bright)' : '2px solid transparent',
                  marginBottom: -1,
                  background: 'transparent',
                  color: isActive ? 'var(--text-bright)' : 'var(--text-faint)',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-faint)'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 0,
        }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            padding: '60px 0',
            color: 'var(--text-muted)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.78rem',
          }}>
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  )
}
