import { useScrollFade } from '../hooks/useScrollFade'
import { FiDownload, FiFile } from 'react-icons/fi'

export default function Resume() {
  const ref = useScrollFade()

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={ref} className="fade-up">
          <p className="section-eyebrow">04. Resume</p>
          <h2 className="section-title">My <span className="accent">Resume</span></h2>
          <p className="section-subtitle">Full academic and project history.</p>
        </div>

        {/* Resume viewer card */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Titlebar */}
          <div style={{
            background: 'var(--bg-surface)',
            padding: '14px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Traffic lights */}
              <div style={{ display: 'flex', gap: 7 }}>
                {['#ff5f56','#ffbd2e','var(--accent)'].map((c, i) => (
                  <div key={i} style={{
                    width: 11, height: 11, borderRadius: '50%', background: c,
                    boxShadow: i === 2 ? '0 0 6px rgba(0,229,160,0.5)' : 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <FiFile size={13} style={{ color: 'var(--text-muted)' }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                }}>
                  Sobhita_Karri_Resume.pdf
                </span>
              </div>
            </div>
            <a
              href="/resume.pdf"
              download="Sobhita_Karri_Resume.pdf"
              className="btn-outline"
              style={{ fontSize: '0.78rem', padding: '7px 16px', gap: 6 }}
            >
              <FiDownload size={13} />
              Download
            </a>
          </div>

          {/* PDF embed */}
          <iframe
            src="/resume.pdf"
            title="Sobhita Karri Resume"
            style={{
              width: '100%',
              height: '78vh',
              minHeight: 520,
              border: 'none',
              display: 'block',
              background: 'var(--bg-void)',
            }}
          />
        </div>

        {/* wget-style download link */}
        <div style={{
          marginTop: 18,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '14px 20px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: 'var(--accent)' }}>$</span>
          <span>wget</span>
          <a
            href="/resume.pdf"
            download="Sobhita_Karri_Resume.pdf"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Sobhita_Karri_Resume.pdf
          </a>
          <span style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontSize: '0.7rem' }}>188 KB</span>
        </div>
      </div>
    </section>
  )
}
