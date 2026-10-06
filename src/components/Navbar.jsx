import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'

const NAV_LINKS = [
  { label: '01 About',    href: '#about' },
  { label: '02 Domains',  href: '#domains' },
  { label: '03 Projects', href: '#projects' },
  { label: '04 Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle, isDark } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinkStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter Tight, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    padding: '8px 0',
    transition: 'color 0.2s ease',
  }

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? 'var(--bg-nav)' : 'var(--bg-void)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid var(--border)',
          transition: 'background 0.35s ease',
        }}
      >
        <div style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: '0 var(--section-px)',
          height: 'var(--nav-h)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-bright)',
            }}
          >
            Sobhita Karri
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 26 }}>
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-bright)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              style={{
                background: 'none',
                border: '1px solid var(--border-mid)',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-bright)',
              }}
            >
              {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
              style={{
                ...navLinkStyle,
                color: 'var(--text-bright)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-bright)' }}
            >
              Resume
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-bright)',
                padding: 4,
              }}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              top: 'var(--nav-h)',
              background: 'var(--bg-void)',
              zIndex: 99,
              padding: '40px var(--section-px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'clamp(1.6rem, 7vw, 2.2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-bright)',
                  padding: '14px 0',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {link.label}
              </motion.button>
            ))}
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ marginTop: 28, alignSelf: 'flex-start' }}
            >
              Resume
            </a>
            <p style={{
              marginTop: 'auto',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}>
              Theme · {theme}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
