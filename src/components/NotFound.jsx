import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 'var(--section-px)',
      maxWidth: 'var(--max-w)',
      margin: '0 auto',
    }}>
      <p className="section-label">404</p>
      <div style={{
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: 'clamp(4.5rem, 14vw, 8rem)',
        fontWeight: 700,
        color: 'var(--text-bright)',
        lineHeight: 0.95,
        marginBottom: 20,
        letterSpacing: '-0.05em',
      }}>
        Page not found.
      </div>
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-muted)',
        marginBottom: 36,
        maxWidth: '32ch',
      }}>
        This route doesn&apos;t exist. Head back to the portfolio.
      </p>
      <Link
        to="/"
        className="btn-primary"
        style={{ gap: 8, textDecoration: 'none' }}
      >
        <FiArrowLeft size={14} />
        Back home
      </Link>
    </div>
  )
}
