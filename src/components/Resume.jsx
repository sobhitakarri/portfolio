import { useScrollFade } from '../hooks/useScrollFade'

export default function Resume() {
  const ref = useScrollFade()

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-wrapper">
        <div ref={ref} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 04. RESUME
          </p>
          <h2 className="section-title">My <span className="accent">Resume</span></h2>
          <p className="section-subtitle">Full academic and project history.</p>
        </div>

        <div className="ic-card fade-up" style={{ overflow: 'hidden' }}>
          {/* Terminal header */}
          <div style={{
            background: '#13131f',
            padding: '12px 20px',
            borderBottom: '1px solid #1e2030',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff88' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#8892a4', marginLeft: 12 }}>
                resume.pdf — Preview
              </span>
            </div>
            <a
              href="/resume.pdf"
              download="Sobhita_Karri_Resume.pdf"
              className="btn-circuit"
              style={{ fontSize: '0.72rem', padding: '6px 16px' }}
            >
              ↓ Download
            </a>
          </div>

          {/* PDF embed */}
          <iframe
            src="/resume.pdf"
            title="Sobhita Karri Resume"
            style={{
              width: '100%',
              height: '80vh',
              minHeight: 500,
              border: 'none',
              display: 'block',
              background: '#0a0a0f',
            }}
          />
        </div>

        {/* Terminal command style download */}
        <div style={{
          marginTop: 20,
          background: '#0f0f1a',
          border: '1px solid #1e2030',
          borderRadius: 4,
          padding: '14px 20px',
          fontFamily: 'JetBrains Mono',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: '#8892a4',
        }}>
          <span style={{ color: '#00ff88' }}>$</span>
          <span>wget </span>
          <a
            href="/resume.pdf"
            download="Sobhita_Karri_Resume.pdf"
            style={{ color: '#00ff88', textDecoration: 'none' }}
          >
            Sobhita_Karri_Resume.pdf
          </a>
          <span style={{ marginLeft: 'auto', color: '#8892a444', fontSize: '0.7rem' }}>188 KB</span>
        </div>
      </div>
    </section>
  )
}
