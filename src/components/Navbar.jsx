import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog',     href: '#blog' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeSection, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'background 0.3s, border-color 0.3s',
          background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #1e2030' : '1px solid transparent',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo — chip label style */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#00ff88',
              letterSpacing: '0.05em',
            }}>
              {/* IC notch */}
              <svg width="16" height="20" viewBox="0 0 16 20" style={{ flexShrink: 0 }}>
                <rect x="1" y="1" width="14" height="18" rx="2" fill="none" stroke="#00ff88" strokeWidth="1.2" />
                <path d="M5 1 A3 3 0 0 1 11 1" fill="none" stroke="#00ff88" strokeWidth="1.2" />
                <line x1="0" y1="5"  x2="3"  y2="5"  stroke="#00ff88" strokeWidth="1" />
                <line x1="0" y1="9"  x2="3"  y2="9"  stroke="#00ff88" strokeWidth="1" />
                <line x1="0" y1="13" x2="3"  y2="13" stroke="#00ff88" strokeWidth="1" />
                <line x1="13" y1="5"  x2="16" y2="5"  stroke="#00ff88" strokeWidth="1" />
                <line x1="13" y1="9"  x2="16" y2="9"  stroke="#00ff88" strokeWidth="1" />
                <line x1="13" y1="13" x2="16" y2="13" stroke="#00ff88" strokeWidth="1" />
              </svg>
              <span>SONNB</span>
              <span style={{ color: '#8892a4', fontSize: '0.7rem', marginLeft: 2 }}>_v1.0</span>
            </div>
          </button>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                  color: '#8892a4',
                  padding: '8px 12px',
                  transition: 'color 0.2s',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={e => e.target.style.color = '#00ff88'}
                onMouseLeave={e => e.target.style.color = '#8892a4'}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-circuit"
              style={{ marginLeft: 8 }}
            >
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#00ff88', fontSize: '1.4rem', display: 'flex',
            }}
            className="md:hidden"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 260,
              background: '#0f0f1a',
              borderLeft: '1px solid #1e2030',
              zIndex: 200,
              padding: '80px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.95rem',
                  color: '#c9d1d9',
                  padding: '14px 0',
                  textAlign: 'left',
                  borderBottom: '1px solid #1e2030',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#00ff88'}
                onMouseLeave={e => e.target.style.color = '#c9d1d9'}
              >
                <span style={{ color: '#00ff88', marginRight: 8 }}>{'>'}</span>
                {link.label}
              </motion.button>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-circuit"
              style={{ marginTop: 24, textAlign: 'center', justifyContent: 'center' }}
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
