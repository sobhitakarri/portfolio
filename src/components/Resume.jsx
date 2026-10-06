import { useScrollFade } from '../hooks/useScrollFade'
import { FiDownload, FiFile } from 'react-icons/fi'

export default function Resume() {
  const ref = useScrollFade()
  const cardRef = useScrollFade(0.12)

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={ref} className="fade-up">
          <p className="section-label">05 Resume</p>
          <h2 className="section-heading">Full history</h2>
          <p className="section-desc">Academic and project record in one place.</p>
        </div>

        <div
          ref={cardRef}
          className="fade-up fade-up-delay-1"
          style={{
            border: '1px solid var(--border)',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{
            padding: '14px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiFile size={13} style={{ color: 'var(--text-faint)' }} />
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}>
                Sobhita_Karri_Resume.pdf
              </span>
            </div>
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              download="Sobhita_Karri_Resume.pdf"
              className="btn-outline"
              style={{ fontSize: '0.7rem', padding: '8px 14px', gap: 6 }}
            >
              <FiDownload size={12} />
              Download
            </a>
          </div>

          <iframe
            src={`${import.meta.env.BASE_URL}resume.pdf`}
            title="Sobhita Karri Resume"
            style={{
              width: '100%',
              height: '75vh',
              minHeight: 480,
              border: 'none',
              display: 'block',
              background: 'var(--bg-elevated)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
