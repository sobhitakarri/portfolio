import { useScrollFade } from '../hooks/useScrollFade'
import { FiDownload, FiFile, FiExternalLink } from 'react-icons/fi'

export default function Resume() {
  const ref = useScrollFade()
  const cardRef = useScrollFade(0.12)

  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ fontSize: '0.7rem', padding: '8px 14px', gap: 6 }}
              >
                <FiExternalLink size={12} />
                Open
              </a>
              <a
                href={resumeUrl}
                download="Sobhita_Karri_Resume.pdf"
                className="btn-outline"
                style={{ fontSize: '0.7rem', padding: '8px 14px', gap: 6 }}
              >
                <FiDownload size={12} />
                Download
              </a>
            </div>
          </div>

          <object
            data={resumeUrl}
            type="application/pdf"
            style={{
              width: '100%',
              height: '80vh',
              minHeight: 520,
              display: 'block',
              background: 'var(--bg-elevated)',
            }}
          >
            <iframe
              src={resumeUrl}
              title="Sobhita Karri Resume"
              style={{
                width: '100%',
                height: '80vh',
                minHeight: 520,
                border: 'none',
                display: 'block',
                background: 'var(--bg-elevated)',
              }}
            >
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: 16 }}>Inline PDF preview is not supported on this device.</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View Resume
                </a>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </section>
  )
}
