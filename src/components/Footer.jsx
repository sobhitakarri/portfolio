import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2 }}>
      {/* Top gradient border */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--border-mid) 30%, var(--accent) 50%, var(--border-mid) 70%, transparent 100%)',
      }} />

      <div style={{
        background: 'var(--bg-void)',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Left — logo + tagline */}
          <div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-bright)',
              marginBottom: 4,
            }}>
              <span style={{ color: 'var(--accent)' }}>SONNB</span>
              {' '}
              <span style={{ color: 'var(--text-faint)', fontWeight: 400, fontSize: '0.8rem' }}>
                © {new Date().getFullYear()}
              </span>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              color: 'var(--text-faint)',
              letterSpacing: '0.04em',
            }}>
              Built with RTL-level precision
            </div>
          </div>

          {/* Center — stack badge */}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.68rem',
            color: 'var(--text-faint)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{'<'}</span>
            React · Vite · Framer Motion
            <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{'>'}</span>
          </div>

          {/* Right — social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: FiGithub,   href: 'https://github.com/sobhita-karri',           label: 'GitHub' },
              { icon: FiLinkedin, href: 'https://linkedin.com/in/sobhita-karri',       label: 'LinkedIn' },
              { icon: FiMail,     href: 'mailto:sobhita1011@gmail.com',                label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 38,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-elevated)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderColor = 'var(--border-light)'
                  e.currentTarget.style.background = 'var(--accent-faint)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,229,160,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-elevated)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
