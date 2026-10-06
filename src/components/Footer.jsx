import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const socialLinks = [
  { icon: <FiGithub   size={16} />, label: 'GitHub',   href: 'https://github.com/sobhitakarri' },
  { icon: <FiLinkedin size={16} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sobhita-karri-a89506316/' },
  { icon: <FiMail     size={16} />, label: 'Email',    href: 'mailto:sobhita1011@gmail.com' },
]

const navLinks = [
  { label: 'About',    href: '#about' },
  { label: 'Domains',  href: '#domains' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        maxWidth: 'var(--max-w)',
        margin: '0 auto',
        padding: '56px var(--section-px) 36px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 36,
          marginBottom: 48,
        }}>
          <div>
            <div style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-bright)',
              marginBottom: 12,
            }}>
              Sobhita Karri
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              maxWidth: 300,
              lineHeight: 1.6,
            }}>
              Building intelligent systems where software, hardware, and physical autonomy converge.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-bright)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          height: 1,
          background: 'var(--border)',
          marginBottom: 24,
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36,
                  border: '1px solid transparent',
                  color: 'var(--text-faint)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-faint)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          <p style={{
            color: 'var(--text-faint)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
          }}>
            © {new Date().getFullYear()} Sobhita Karri
          </p>
        </div>
      </div>
    </footer>
  )
}
