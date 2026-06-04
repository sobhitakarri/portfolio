import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeSection, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracker
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace('#',''))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
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
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled
            ? 'rgba(6, 6, 16, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(30, 32, 56, 0.8)'
            : '1px solid transparent',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: '0 var(--section-px)',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-bright)',
            }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent), var(--blue))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#060610',
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: '0 0 16px rgba(0, 229, 160, 0.3)',
              }}>
                SN
              </div>
              <span>Sobhita</span>
            </div>
          </button>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href.replace('#','')
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: isActive ? 'rgba(0, 229, 160, 0.08)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--accent)' : 'var(--text-body)',
                    padding: '7px 14px',
                    borderRadius: 6,
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.target.style.color = 'var(--text-bright)'
                      e.target.style.background = 'rgba(255,255,255,0.04)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.target.style.color = 'var(--text-body)'
                      e.target.style.background = 'none'
                    }
                  }}
                >
                  {link.label}
                </button>
              )
            })}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ marginLeft: 8, padding: '8px 20px', fontSize: '0.85rem', borderRadius: 6 }}
            >
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-bright)', fontSize: '1.3rem',
              display: 'flex', padding: 6,
            }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(6,6,16,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 198,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 280,
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border)',
                zIndex: 199,
                padding: '88px 28px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem', fontWeight: 500,
                    color: 'var(--text-body)',
                    padding: '14px 12px',
                    textAlign: 'left',
                    borderRadius: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.background = 'var(--accent-faint)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-body)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginTop: 20, justifyContent: 'center' }}
              >
                Download Resume
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
