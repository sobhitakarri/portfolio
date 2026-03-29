import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      zIndex: 2,
      borderTop: '1px solid #1e2030',
      background: '#0a0a0f',
    }}>
      {/* Green glow line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, #00ff8844, #00ff88, #00ff8844, transparent)',
        marginBottom: -1,
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '28px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Left */}
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#8892a4' }}>
          <span style={{ color: '#00ff88' }}>SONNB</span>
          {' '}©{new Date().getFullYear()}
          {' '}—{' '}
          <span style={{ color: '#8892a466' }}>Built with RTL-level precision</span>
        </div>

        {/* Right — social icons */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { icon: FiGithub,   href: 'https://github.com/sonnb',           label: 'GitHub' },
            { icon: FiLinkedin, href: 'https://linkedin.com/in/sonnb',       label: 'LinkedIn' },
            { icon: FiMail,     href: 'mailto:sonnb@example.com',            label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                color: '#8892a4',
                display: 'flex',
                transition: 'color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#00ff88'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#8892a4'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
